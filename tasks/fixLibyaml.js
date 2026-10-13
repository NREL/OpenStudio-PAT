'use strict';

// Issue #315: on macOS the OpenStudio-server psych.bundle files are linked
// against the Homebrew libyaml (/usr/local/opt/libyaml/...), which doesn't
// exist on most machines. None of the dependency artifacts ship a libyaml
// dylib, so we build one from the pinned upstream source, place it inside the
// server, and rewrite psych.bundle to load it relative to itself.

const os = require('os');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const https = require('https');
const crypto = require('crypto');

const conf = require('./conf');

const LIBYAML_VERSION = '0.2.5';
const LIBYAML_URL = `https://github.com/yaml/libyaml/releases/download/${LIBYAML_VERSION}/yaml-${LIBYAML_VERSION}.tar.gz`;
const LIBYAML_SHA256 = 'c642ae9b75fee120b2d96c712538bd2cf283228d2337df2cf2988e3c02678ef4';
const DYLIB_NAME = 'libyaml-0.2.dylib';

function run(cmd, args, opts) {
  return execFileSync(cmd, args, Object.assign({ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }, opts));
}

function findFiles(dir, name, out) {
  out = out || [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(full, name, out);
    } else if (entry.name === name) {
      out.push(full);
    }
  }
  return out;
}

function download(url, dest, redirects) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && (redirects || 0) < 5) {
        res.resume();
        return resolve(download(res.headers.location, dest, (redirects || 0) + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`GET ${url} failed: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Returns the non-system libyaml install name the bundle links, or null
function missingLibyamlRef(bundle) {
  const lines = run('otool', ['-L', bundle]).split('\n').slice(1);
  for (const line of lines) {
    const ref = line.trim().split(' ')[0];
    if (/libyaml.*\.dylib$/.test(ref) && !ref.startsWith('@') && !ref.startsWith('/usr/lib/')) {
      return ref;
    }
  }
  return null;
}

function archsOf(file) {
  return run('lipo', ['-archs', file]).trim().split(/\s+/);
}

async function buildLibyaml(archs, outFile, workDir) {
  const tarball = path.join(workDir, 'libyaml.tar.gz');
  await download(LIBYAML_URL, tarball);
  const sum = crypto.createHash('sha256').update(fs.readFileSync(tarball)).digest('hex');
  if (sum !== LIBYAML_SHA256) {
    throw new Error(`libyaml checksum mismatch: ${sum}`);
  }
  run('tar', ['xzf', tarball, '-C', workDir]);
  const src = path.join(workDir, `yaml-${LIBYAML_VERSION}`, 'src');
  const include = path.join(workDir, `yaml-${LIBYAML_VERSION}`, 'include');
  const sources = ['api.c', 'dumper.c', 'emitter.c', 'loader.c', 'parser.c', 'reader.c', 'scanner.c', 'writer.c']
    .map(f => path.join(src, f));
  const archFlags = [].concat(...archs.map(a => ['-arch', a]));
  run('clang', [
    '-dynamiclib', '-O2', ...archFlags,
    '-mmacosx-version-min=10.13',
    '-DYAML_VERSION_MAJOR=0', '-DYAML_VERSION_MINOR=2', '-DYAML_VERSION_PATCH=5',
    '-DYAML_VERSION_STRING="0.2.5"', '-DYAML_DECLARE_EXPORT',
    '-I' + include, '-I' + src,
    '-install_name', '@rpath/' + DYLIB_NAME,
    '-compatibility_version', '3.0.0', '-current_version', '3.9.0',
    '-o', outFile, ...sources
  ]);
}

async function fixLibyaml() {
  if (os.platform() !== 'darwin') {
    return;
  }
  const argv = require('yargs').argv;
  const depDir = argv.prefix || path.join(conf.paths.dist, '..', 'depend');
  const serverDir = path.join(depDir, 'OpenStudio-server');
  if (!fs.existsSync(serverDir)) {
    console.log('fixLibyaml: no OpenStudio-server at ' + serverDir + ', skipping');
    return;
  }

  const allBundles = findFiles(serverDir, 'psych.bundle');
  if (allBundles.length === 0) {
    const nested = fs.readdirSync(serverDir).filter(f => /\.(tar\.gz|tgz)$/i.test(f));
    const detail = nested.length > 0
      ? `it still contains an unextracted nested archive (${nested.join(', ')}); run "gulp installDeps" with the nested-tarball unwrap fix (#329)`
      : 'no psych.bundle was found';
    throw new Error(`fixLibyaml: ${serverDir} exists but ${detail}`);
  }

  const bundles = allBundles.filter(b => missingLibyamlRef(b));
  if (bundles.length === 0) {
    console.log('fixLibyaml: no psych.bundle with an external libyaml reference, nothing to do');
    return;
  }

  const archs = archsOf(bundles[0]);
  for (const bundle of bundles) {
    const other = archsOf(bundle);
    if (other.slice().sort().join() !== archs.slice().sort().join()) {
      throw new Error(`fixLibyaml: psych.bundle architectures differ (${bundles[0]}: ${archs.join(',')} vs ${bundle}: ${other.join(',')})`);
    }
  }
  const libDir = path.join(serverDir, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  const dylib = path.join(libDir, DYLIB_NAME);

  if (!fs.existsSync(dylib)) {
    const workDir = fs.mkdtempSync(path.join(path.dirname(serverDir), '.libyaml-build-'));
    try {
      console.log(`fixLibyaml: building libyaml ${LIBYAML_VERSION} (${archs.join(',')})`);
      await buildLibyaml(archs, dylib, workDir);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
    }
  }

  for (const bundle of bundles) {
    const oldRef = missingLibyamlRef(bundle);
    const rel = path.relative(path.dirname(bundle), dylib);
    run('install_name_tool', ['-change', oldRef, '@loader_path/' + rel, bundle]);
    // install_name_tool invalidates any signature; arm64 requires one
    run('codesign', ['--force', '--sign', '-', bundle]);
    console.log(`fixLibyaml: patched ${path.relative(serverDir, bundle)}`);
  }
  run('codesign', ['--force', '--sign', '-', dylib]);
}

exports.fixLibyaml = fixLibyaml;

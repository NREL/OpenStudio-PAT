# macOS Build Troubleshooting Guide

## Issues Identified and Fixed

### 1. Qt Installer Framework Installation Issues

**Problem**: The workflow was using direct DMG download and installation which was unreliable on GitHub Actions runners.

**Original code**:
```yaml
curl -L -O https://download.qt.io/archive/qt-installer-framework/4.3.0/QtInstallerFramework-macOS-x64-4.3.0.dmg
hdiutil attach -mountpoint ./qtfiw_installer QtInstallerFramework-macOS-x64-4.3.0.dmg
sudo ./qtfiw_installer/QtInstallerFramework-macOS-x64-4.3.0.app/Contents/MacOS/QtInstallerFramework-macOS-x64-4.3.0 --verbose --script ./ci/install_script_qtifw.qs
```

**Fixed with**:
```yaml
pip install aqtinstall
python3 -m aqt install-tool -O ${{ github.workspace }}/Qt/ mac desktop tools_ifw
```

**Benefits**:
- More reliable installation process
- Automatic version detection
- Better error handling
- Faster installation

### 2. Removed Hardcoded Xcode SDK Root

**Problem**: The workflow specified `SDKROOT: /Applications/Xcode_15.2.app` which may not exist on all runners.

**Fixed by**: Removing the hardcoded SDKROOT and letting the system use the default Xcode installation.

### 3. Fixed CMAKE_OSX_DEPLOYMENT_TARGET Usage

**Problem**: The deployment target was set as an environment variable but not properly used in the cmake command.

**Fixed by**: Explicitly passing the deployment target to cmake:
```yaml
cmake -DCMAKE_OSX_ARCHITECTURES="arm64" \
      -DCMAKE_OSX_DEPLOYMENT_TARGET="${{ matrix.MACOSX_DEPLOYMENT_TARGET }}" \
      -DCMAKE_BUILD_TYPE=Release \
      ../
```

### 4. Improved Path Detection for Qt Tools

**Problem**: Hardcoded paths to Qt tools that may not match the actual installation directory.

**Fixed with**:
```bash
QT_IFW_DIR=$(find ${{ github.workspace }}/Qt/Tools/QtInstallerFramework -maxdepth 1 -type d -name "*" | head -1)
echo "$QT_IFW_DIR/bin/" >> $GITHUB_PATH
```

## Build Matrix Configuration

The workflow now properly supports:
- **macOS-Intel**: Running on `macos-13` with `x86_64` architecture
- **macOS-ARM**: Running on `macos-14` with `arm64` architecture

## Testing the Fixes

To test these fixes:

1. **Run the workflow manually** through GitHub Actions
2. **Check the Qt installation step** - should show successful installation
3. **Verify cmake configuration** - should complete without errors
4. **Check final artifact generation** - should produce installer packages

## Future Improvements

1. **Cache Qt installation** - Consider caching the Qt tools to speed up builds
2. **Upgrade to newer Qt versions** - Keep Qt Installer Framework updated
3. **Add retry logic** - Add retry mechanisms for network-dependent operations
4. **Enhanced error reporting** - Add better error messages and debugging output

## Debugging Commands

If builds still fail, add these debugging commands to the workflow:

```yaml
- name: Debug Environment
  run: |
    echo "Current PATH: $PATH"
    echo "Available Xcode versions:"
    ls -la /Applications/Xcode*
    echo "Qt installation:"
    find ${{ github.workspace }}/Qt -name "*" -type d | head -20
    echo "CMake version:"
    cmake --version
```

## Common Issues and Solutions

### Issue: "QtIFW not found in PATH"
**Solution**: Ensure the Qt tools are properly added to PATH as shown in the fixes above.

### Issue: "No such file or directory" during cmake
**Solution**: Check that all dependencies are properly installed and available.

### Issue: Build fails with architecture mismatch
**Solution**: Ensure CMAKE_OSX_ARCHITECTURES matches the runner architecture.

## Contact

For additional support, check:
- GitHub Actions logs for detailed error messages
- CMake configuration output
- Qt installation logs

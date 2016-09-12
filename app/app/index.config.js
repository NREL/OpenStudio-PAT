import en from './translations/en.js';
import fr from './translations/fr.js';

export function config($logProvider, $translateProvider, toastrConfig) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  $translateProvider
    .translations('en', en)
    .translations('fr', fr)
    .fallbackLanguage('en')
    .preferredLanguage('en')
    //.determinePreferredLanguage()
    .useMissingTranslationHandlerLog()
    .useSanitizeValueStrategy('escape');

  // Set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = false; // need duplicates on BCL library view
  toastrConfig.progressBar = true;

}

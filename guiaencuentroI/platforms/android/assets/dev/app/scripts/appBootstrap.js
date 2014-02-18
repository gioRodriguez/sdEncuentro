/**
 * 
 */

define('appBootstrap', [ 'guiaEncuentroApp', 'localStgeService',
		'constantsService', 'navigationService', 'cordovaServices',
		'settingsController', 'textViewerController' ], function(guiaEncuentroApp) {
	guiaEncuentroApp.run([
			'localStorageService',
			'constantsService',
			'$translate',
			function(localStorageService, constantsService, $translate) {
				localStorageService.set(constantsService.selectedDateKey, new Date()
						.toString(constantsService.dateFormat));

				// load language
				var langSelecByUser = localStorageService
						.get(constantsService.preferredLanguageKey);
				var defaultLang = constantsService.preferredLanguageDefault;
				$translate.uses(langSelecByUser || defaultLang);
			} ]);
});
/**
 * services for interact with the data layer
 */
define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	var dataServices = function($http) {
		var dataServicesFactory = {};

		/**
		 * selectedDate format 'yyyy-MMMM-dd'
		 */
		dataServicesFactory.getTextByDate = function(selectedDate) {
			var textDeferred = $.Deferred();

			// @if NODE_ENV development
			/*window.getText = function(date, successCallback) {
				successCallback("<div class='readHeader'>" +
						"<ul><li><h1><span></span>﻿Lectura Del Año Bíblico Del Plan Encuentro I</h1></li>" +
						"<li><h2><span></span>21 De Julio</h2></li>" +
						"<li><h3><span></span>Deseado De Todas Las Gentes, Pág. 435-437.</h3></li>" +
						"</ul></div><div class='readContent'>" +
						"<hr>" +
						"EL DESEADO DE TODAS LAS GENTES, PÁGINAS 435-437." +
						"Abrahán aprendió de Dios la mayor lección que haya sido dada a los mortales. Su oración porque pudiera ver a Cristo 435 antes de morir fue contestada. Vio a Cristo; vio todo lo que el mortal puede ver y vivir. Mediante una entrega completa, pudo comprender esa visión referente a Cristo. Se le mostró que al dar a su Hijo unigénito para salvar a los pecadores de la ruina eterna, Dios hacía un sacrificio mayor y más asombroso que el que jamás pudiera hacer el hombre." +
						"La experiencia de Abrahán contestó la pregunta:");
			};*/
			// @endif
			window.getText(selectedDate, function(text) {
				textDeferred.resolve(text);
			}, function() {
				textDeferred.reject();
			});

			return textDeferred.promise();
		};

		return dataServicesFactory;
	};

	guiaEncuentroApp.factory('dataServices', [ '$http', dataServices ]);
});
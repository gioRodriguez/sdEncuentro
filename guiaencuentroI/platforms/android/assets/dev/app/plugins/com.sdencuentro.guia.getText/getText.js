/**
 * 
 */

window.getText = function(dateSelected, callback, failure) {
  cordova.exec(callback, failure, "GetText", "getText", [ dateSelected ]);
};
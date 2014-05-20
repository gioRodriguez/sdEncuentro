cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.min.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.min.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.min.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
      "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.min.js",
      "id": "org.apache.cordova.splashscreen.SplashScreen",
      "clobbers": [
          "navigator.splashscreen"
      ]
    },
    {
      "file": "plugins/org.apache.cordova.network-information/www/network.min.js",
      "id": "org.apache.cordova.network-information.network",
      "clobbers": [
          "navigator.connection",
          "navigator.network.connection"
      ]
	  },
	  {
	      "file": "plugins/org.apache.cordova.network-information/www/Connection.min.js",
	      "id": "org.apache.cordova.network-information.Connection",
	      "clobbers": [
	          "Connection"
	      ]
	  }
];
module.exports.metadata = 
//TOP OF METADATA
{
  "org.apache.cordova.dialogs": "0.2.6",
  "org.apache.cordova.vibration": "0.3.7",
  "org.apache.cordova.inappbrowser": "0.3.1",
  "org.apache.cordova.splashscreen": "0.3.0",
  "org.apache.cordova.network-information": "0.2.8"
}
//BOTTOM OF METADATA
});
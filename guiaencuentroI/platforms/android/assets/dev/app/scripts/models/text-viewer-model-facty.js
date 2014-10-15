(function() {
  'use strict';
  angular.module('guiaEncuentroApp').factory('TextViewerModelFacty', [
    '$timeout',
    'userSettingsService',
    'scrollService',
    '$q',
    'dialogService',
    '$translate',
    'textService',
    'facebookService',
    function TextViewerModelFacty(
      $timeout,
      userSettingsService,
      scrollService,
      $q,
      dialogService,
      $translate,
      textService,
      facebookService
    ) {
      var FONT_SIZES = [
        '0.5rem', // the cero position is not valid
        '0.5rem',
        '1rem',
        '1.5rem',
        '2rem',
        '2.5rem',
        '3rem',
        '3.5rem',
        '4rem',
        '4.5rem',
        '5rem'
      ];
      var MIN_FONT_SIZE = 1;
      var MAX_FONT_SIZE = FONT_SIZES.length;
      var indexPreferredFontSize;
      var _isFooterVisible = false;
      
      TextViewerModelFacty.isFooterVisible = function(){
        return _isFooterVisible;
      };
      
      function hideFooter(){        
        _isFooterVisible = false;
      }
      
      TextViewerModelFacty.hideFooterSlowly = function(){
        $timeout(function(){
          hideFooter();
        }, 3000);
      }
 
      TextViewerModelFacty.showFooter = function (){
        _isFooterVisible = true;
      }
      
      TextViewerModelFacty.showHideFooter = function (){
        TextViewerModelFacty.isFooterVisible() ? hideFooter() : TextViewerModelFacty.showFooter();
      }
      
      TextViewerModelFacty.init = function(){
        hideFooter();
      }
      
      TextViewerModelFacty.isHigthConstrastEnabled = function(){
        return userSettingsService.isHighConstrastEnabled();
      }
      
      function turnOffHighConstrast (){
        userSettingsService.turnOffHighConstrast();
      }
      
      function turnOnHighConstrast (){
        userSettingsService.turnOnHighConstrast();
      }
      
      TextViewerModelFacty.turnOnTurnOffHigthConstrast = function(){
        if (TextViewerModelFacty.isHigthConstrastEnabled()) {
          turnOffHighConstrast();
        } else {
          turnOnHighConstrast();
        }
      }
      
      TextViewerModelFacty.getUserPreferredFontSize = function(){
        indexPreferredFontSize = userSettingsService.getPreferedFontSize();
        return FONT_SIZES[indexPreferredFontSize];
      }
      
      TextViewerModelFacty.setUserPreferredFontSize = function(indexPreferredFontSize){
        userSettingsService.savePreferedFontSize(indexPreferredFontSize);
      }
      
      function isDisableMinFontSize(){
        return indexPreferredFontSize - 1 < MIN_FONT_SIZE;
      }
      
      function isDisablePlusFontSize(){
        return indexPreferredFontSize + 1 >= MAX_FONT_SIZE;
      }
      
      TextViewerModelFacty.plusMinFont = function(isPlus){
        scrollService.prepareResize();

        if (isPlus &&
          !isDisablePlusFontSize()) {
          indexPreferredFontSize++;
        }

        if (!isPlus &&
          !isDisableMinFontSize()) {
          indexPreferredFontSize--;
        }
        
        $timeout(function() {
          scrollService.resize();
        });
        
        userSettingsService.savePreferedFontSize(indexPreferredFontSize);
        
        return {
          fontSize: FONT_SIZES[indexPreferredFontSize],
          disablePlusFontSize: isDisablePlusFontSize(),
          disableMinFontSize: isDisableMinFontSize()
        };
      }
      
      TextViewerModelFacty.text = '';
      
      TextViewerModelFacty.getTextByDate = function(selectedDate){
        var defer = $q.defer();
        
        textService.getTextByDate(selectedDate).done(function(data) {          
          TextViewerModelFacty.text = data;
          defer.resolve();                   
        }).fail(
            function(data) {              
              dialogService.showError('textAskedFailDesc');
              defer.resolve();
            });
        
        return defer.promise;
      }
      
      function getTextForPublish() {
        if (TextViewerModelFacty.text) {
          var textToPublish = getReadBodyText();
          return String(textToPublish).replace(/<[^>]+>/gm, '#s').replace(/(#s)+/gm, ' ')
              .substring(0, 600) +
            '...';
        }
        return null;
      }

      function getReadBodyText() {
        if (TextViewerModelFacty.text.indexOf("readBoby")) {
          return TextViewerModelFacty.text.split("readBoby'>")[1];
        }

        return TextViewerModelFacty.text;
      }
      
      TextViewerModelFacty.facebookPublish = function(){
        var defer = $q.defer();
        
        var text = getTextForPublish();
        if (!text) {
          defer.reject();
        }

        var publication = {
          message : text,
          link : $translate('publicationLink'),
          picture : $translate('publicationPicture'),
          name : $translate('publicationAppName'),
          caption : $translate('publicationAppCaption')
        };

        facebookService.publish(publication).then(
            function() {
              dialogService.showInfo('publishFacebook');
              defer.resolve();
            },
            function(error) {
              if (error.isNetworkException) {
                dialogService.showError('notNetworkDesc');
              } else {
                dialogService.showError('publishFail');
              }
              defer.reject();
            });
        
        return defer.promise;
      }
      
      return TextViewerModelFacty;
    }
  ]);
})();
/**
 * facebook service test
 */
'use strict';

describe('facebookService test', function() {

  beforeEach(module('guiaEncuentroApp'));

  var injector;
  var facebookService;
  var cordovaServices;
  var isConnectionAvaulableDeferred = $.Deferred();

  beforeEach(function() {
    var facebookConnectPlugin = jasmine.createSpyObj('facebookConnectPlugin', [
      'getLoginStatus',
      'login',
      'logout',
      'showDialog'
    ]);
    facebookConnectPlugin.getLoginStatus = function() {
    };
    facebookConnectPlugin.login = function() {
    };
    facebookConnectPlugin.logout = function() {
    };
    facebookConnectPlugin.showDialog = function() {
    };
    spyOn(facebookConnectPlugin, 'showDialog').andCallFake(function(data, cb, cb2) {
      cb();
    });
    window.facebookConnectPlugin = facebookConnectPlugin;

    cordovaServices = jasmine.createSpyObj('cordovaServices', [
      'isNetworkAvailable',
      'isNetworkAvailableAsync'
    ]);
    cordovaServices.isNetworkAvailable = function() {
    }
    cordovaServices.isNetworkAvailableAsync = function(success) {
      return isConnectionAvaulableDeferred.promise();
    }
    isConnectionAvaulableDeferred.resolve();
    spyOn(cordovaServices, 'isNetworkAvailable').andCallFake(function() {
      return true;
    });
    module(function($provide) {
      $provide.value('cordovaServices', cordovaServices);
    });

    inject(function($injector) {
      injector = $injector
    });
  });

  it(
      'hasActiveAccount must throw NotNetworkException when there is not network',
      function() {
        // arrange
        var connectionAvailableDeferred = $.Deferred();
        cordovaServices.isNetworkAvailableAsync = function() {
          return connectionAvailableDeferred.promise();
        }
        connectionAvailableDeferred.reject();
        var facebookService = injector.get('facebookService');

        // act
        var hasActiveAccountPromise = facebookService.hasActiveAccount();

        // assert
        expect(hasActiveAccountPromise.state()).toBe('rejected');
      });

  it('publish must throw NotNetworkException when there is not network', function() {
    // arrange
    var connectionAvailableDeferred = $.Deferred();
    cordovaServices.isNetworkAvailableAsync = function() {
      return connectionAvailableDeferred.promise();
    }
    connectionAvailableDeferred.reject();
    var facebookService = injector.get('facebookService');

    // act
    var publishPromise = facebookService.publish();

    // assert
    expect(publishPromise.state()).toBe('rejected');
  });

  it('must do facebook logout', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'logout').andCallFake(function(logoutCallback) {
      logoutCallback();
    });
    var facebookService = injector.get('facebookService');

    // act
    var logoutPromise = facebookService.logout();

    // assert
    expect(facebookConnectPlugin.logout).toHaveBeenCalled();
    expect(logoutPromise.state()).toBe('resolved');
  });

  it('must resolve if there is a facebook account valid', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
      loginStatusCallback({
        authResponse : {
          accessToken: true
        }
      });
    });
    var facebookService = injector.get('facebookService');

    // act
    var hasActiveAccountPromise = facebookService.hasActiveAccount();

    // assert
    expect(hasActiveAccountPromise.state()).toBe('resolved');
  });

  it('must reject if there is a facebook account valid', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
      loginStatusCallback({
        authResponse : false
      });
    });
    var facebookService = injector.get('facebookService');

    // act
    var hasActiveAccountPromise = facebookService.hasActiveAccount();

    // assert
    expect(hasActiveAccountPromise.state()).toBe('rejected');
  });

  it('must directly publish when has a previous login active', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
      loginStatusCallback({
        authResponse : {
          accessToken: true
        }
      });
    });
    var facebookService = injector.get('facebookService');

    var publication = {
      message : 'hello world',
      link : 'appLink',
      picture : 'appPicture',
      name : 'appName',
      caption : 'appCaption'
    }

    // act
    var publishPromise = facebookService.publish(publication);

    // assert
    expect(facebookConnectPlugin.showDialog).toHaveBeenCalledWith({
        method : 'feed',
        link : publication.link,
        picture : publication.picture,
        name : publication.name,
        caption : publication.caption
      },
      jasmine.any(Function),
      jasmine.any(Function));
    expect(publishPromise.state()).toBe('resolved');
  });

  it('must ask login and publish if the login was successful', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'login').andCallFake(function(permisses, loginSuccessCb, loginFailedCb) {
      loginSuccessCb();
    });
    
    spyOn(facebookConnectPlugin, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
      loginStatusCallback({
        authResponse : false
      });
    });
    var facebookService = injector.get('facebookService');

    var publication = {
      message : 'hello world',
      link : 'appLink',
      picture : 'appPicture',
      name : 'appName',
      caption : 'appCaption'
    }

    // act
    var publishPromise = facebookService.publish(publication);

    // assert
    expect(facebookConnectPlugin.login).toHaveBeenCalledWith(['email'], jasmine.any(Function), jasmine.any(Function));
    expect(facebookConnectPlugin.showDialog).toHaveBeenCalledWith({
        method : 'feed',
        link : publication.link,
        picture : publication.picture,
        name : publication.name,
        caption : publication.caption
      },
      jasmine.any(Function),
      jasmine.any(Function));
    expect(publishPromise.state()).toBe('resolved');
  });

  it('must reject the the publish if the login was unsuccessful', function() {
    // arrange
    spyOn(facebookConnectPlugin, 'login').andCallFake(function(permisses, loginSuccessCb, loginFailedCb) {
      loginFailedCb();
    });
    spyOn(facebookConnectPlugin, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
      loginStatusCallback({
        authResponse : false
      });
    });
    var facebookService = injector.get('facebookService');

    // act
    var publishPromise = facebookService.publish('hello world');

    // assert
    expect(facebookConnectPlugin.login).toHaveBeenCalledWith(['email'], jasmine.any(Function), jasmine.any(Function));
    expect(publishPromise.state()).toBe('rejected');
  });
});
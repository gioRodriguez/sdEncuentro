/**
 * 
 */
describe('text-service-test', function() {
  beforeEach(module('guiaEncuentroApp'));

  var injector;
  var textService;
  var _localStorageService;
  var provide;
  var deferred;

  beforeEach(function() {
    var $ = jasmine.createSpyObj('$', [
      'Deferred'
    ]);
    window.$ = $;
    deferred = jasmine.createSpyObj('deferred', [
      'promise',
      'reject',
      'resolve'
    ]);
    $.Deferred = function() {
      return deferred;
    }

    window.getText = function() {
    };
    spyOn(window, 'getText').andCallFake(function(date, func) {
      func('from file');
    });

    _localStorageService = jasmine.createSpyObj('_localStorageService', [
      'get',
      'set'
    ]);

    module(function($provide) {
      _localStorageService.get = function() {
      };

      spyOn(_localStorageService, 'get').andCallFake(function() {
        return {
          'selectedDate' : '1988-abril-10',
          'text' : 'from storage'
        }
      });

      $provide.value('localStorageService', _localStorageService);
    });

    inject(function($injector) {
      injector = $injector;
    });
  });

  it('must get the text from file', function() {
    // arrange
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-09');

    // assert
    expect(deferred.resolve).toHaveBeenCalled();
    expect(window.getText).toHaveBeenCalledWith('1988-abril-09', jasmine.any(Function));
    expect(_localStorageService.set).toHaveBeenCalledWith(
        'text',
        {
          selectedDate: '1988-abril-09',
          text: 'from file'
        }
    );
  });

  it('must get the text from local storage', function() {
    // arrange
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-10');

    // assert
    expect(deferred.resolve).toHaveBeenCalledWith('from storage');
    expect(_localStorageService.get).toHaveBeenCalledWith('text');
    expect(window.getText).not.toHaveBeenCalled();
  });

  it('must get the text from file when storage has text for other date', function() {
    // arrange
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-20');

    // assert
    expect(deferred.resolve).toHaveBeenCalledWith('from file');
    expect(_localStorageService.get).toHaveBeenCalled();
    expect(_localStorageService.set).toHaveBeenCalled();
    expect(window.getText).toHaveBeenCalled();
  });

  it('must get the text dy date with not valid date', function() {
    // arrange
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('');

    // assert
    expect(deferred.reject).toHaveBeenCalled();
    expect(window.getText).not.toHaveBeenCalled();
  });
})
/**
 * 
 */
describe('text-service-test', function() {
  beforeEach(module('guiaEncuentroApp'));

  var injector;
  var textService;
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
    $.ajax = function() {
    };

    inject(function($injector) {
      injector = $injector;
    });
  });

  it('must get the text dy date', function() {
    // arrange
    spyOn($, 'ajax').andCallFake(function(ajaxOptions) {
      ajaxOptions.success();
    });
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-09');

    // assert
    expect(deferred.resolve).toHaveBeenCalled();
    expect($.ajax).toHaveBeenCalledWith({
      url : 'texts/abril/abril9.txt',
      dataType : 'text',
      success : jasmine.any(Function),
      error : jasmine.any(Function)
    });
  });

  it('must get the text dy date with day', function() {
    // arrange
    spyOn($, 'ajax').andCallFake(function(ajaxOptions) {
      ajaxOptions.success();
    });
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-1');

    // assert
    expect(deferred.resolve).toHaveBeenCalled();
    expect($.ajax).toHaveBeenCalledWith({
      url : 'texts/abril/abril1.txt',
      dataType : 'text',
      success : jasmine.any(Function),
      error : jasmine.any(Function)
    });
  });

  it('must get the text dy date with day', function() {
    // arrange
    spyOn($, 'ajax').andCallFake(function(ajaxOptions) {
      ajaxOptions.success();
    });
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-abril-001');

    // assert
    expect(deferred.resolve).toHaveBeenCalled();
    expect($.ajax).toHaveBeenCalledWith({
      url : 'texts/abril/abril1.txt',
      dataType : 'text',
      success : jasmine.any(Function),
      error : jasmine.any(Function)
    });
  });

  it('must get the text dy date with month in Upper', function() {
    // arrange
    spyOn($, 'ajax').andCallFake(function(ajaxOptions) {
      ajaxOptions.success();
    });
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('1988-Abril-11');

    // assert
    expect(deferred.resolve).toHaveBeenCalled();
    expect($.ajax).toHaveBeenCalledWith({
      url : 'texts/abril/abril11.txt',
      dataType : 'text',
      success : jasmine.any(Function),
      error : jasmine.any(Function)
    });
  });

  it('must get the text dy date with not valid date', function() {
    // arrange
    spyOn($, 'ajax').andCallFake(function(ajaxOptions) {
    });
    textService = injector.get('textService');

    // act
    var textPromise = textService.getTextByDate('');

    // assert
    expect(deferred.reject).toHaveBeenCalled();
    expect($.ajax).not.toHaveBeenCalled();
  });
})
/**
 * Home e2e test
 */

describe('text viewer e2e tests', function() {
  'use sctrict';
  
  beforeEach(function() {
    browser().navigateTo('/');
    
    element('#goReading').click();
  });
  
  it('should show text viewer page', function() {
    // assert
    expect(browser().location().url()).toContain('/textViewer/');
  });

});
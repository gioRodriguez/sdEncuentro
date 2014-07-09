/**
 * Home e2e test
 */

describe('home e2e tests', function() {
  'use sctrict';
  
  beforeEach(function() {        
    browser().navigateTo('/');
  });
  
  it('should show home page', function() {
    // assert
    expect(browser().location().url()).toBe('/');
  });
  
  it('should can go to settings', function() {
    // arrange
    
    // act
    element('#settings').click();
    
    // assert
    expect(browser().location().url()).toBe('/settings');
  });
  
  it('should can go to text viewer', function() {
    // arrange
      
    // act
    element('#goReading').click();
    
    // assert
    expect(browser().location().url()).toContain('/textViewer/');
  });
});
/**
 * Home e2e test
 */

describe('settings e2e tests', function() {
  'use sctrict';
  
  beforeEach(function() {
    browser().navigateTo('/');
    
    element('#settings').click();
  });
  
  it('should show the settings page', function() {
    // assert
    expect(browser().location().url()).toBe('/settings');
  });

});
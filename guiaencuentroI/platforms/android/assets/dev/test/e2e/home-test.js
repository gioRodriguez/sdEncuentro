/**
 * Home e2e test
 */

describe('home e2e tests', function() {
  'use sctrict';
  beforeEach(function() {
    browser.get('http://localhost:9001/index.html');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Super Calculator');
  });
});
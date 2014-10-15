exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/*.js', 'test/e2e/**/home*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}
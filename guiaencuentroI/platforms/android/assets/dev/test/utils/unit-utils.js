function UnitUtils(){
  
  UnitUtils.mockWithReturnValue = function(obj, methodName, valueToReturn){
    obj[methodName] = function() {
    }
    spyOn(obj, methodName).andReturn(valueToReturn);
  }
  
  UnitUtils.mockWithResolvedPromise = function (obj, methodName){
    UnitUtils.mockWithReturnValue(obj, methodName, {
      then: function(fn){
        fn();
        return {
          then: function(){}
        };
      }
    });
  };
  
  UnitUtils.getMockTimeout = function(){
    return function(fn) {
      fn();
    }
  };
  
  return UnitUtils;
};
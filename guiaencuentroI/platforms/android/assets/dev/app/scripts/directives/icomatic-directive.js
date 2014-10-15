/**
 * 
 */
(function() {
	var icomaticDirective = function() {
		var fontfaceSupported = Modernizr.svgasimg;

		// don't use the IcomaticUtils fallback data structure.
		// For performance use a lookup hash instead.
		// This will be orders of magnitude faster.
		var fallbacks = {};

		for (var i = 0; i < IcomaticUtils.fallbacks.length; i++) {
			fallbacks[IcomaticUtils.fallbacks[i].from] = IcomaticUtils.fallbacks[i].to;
		}

		return {
			replace : false,
			restrict : 'A',
			compile : function(element, attr) {
			  return {
			    pre : function(scope, element, attr) {
			      var topcoatIconText = attr.topcoatIcon;

		        $(element).text(topcoatIconText);
		        $(element).addClass("icomatic");

		        // If font-face is not supported then the goal is to end up
		        // with html that looks like this:
		        // <span topcoat-icon="next" class="icomatic">
		        // <span class="icomatic-alt">next</span>
		        // </span>
		        if(!fontfaceSupported){
		          $(element).html('<span class="icomatic-alt">' + topcoatIconText
		              + '</span>' + fallbacks[topcoatIconText]);
		        }  
          }
			  }				
			}
		};
	};

	angular.module('guiaEncuentroApp').directive('topcoatIcon',
			[ icomaticDirective ]);
})();
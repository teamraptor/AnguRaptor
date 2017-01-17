'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

	AnguRaptor.directive('sample', function() {
		return {
			restrict: 'E',
			template: '<span>Sample</span>'
		};
	});
});

'use strict';
define(['AnguRaptor', 'directives/navbar'], function(AnguRaptor) {

	AnguRaptor.controller('IndexCtrl', function($scope) {
		$scope.welcomeText = 'Welcome to your AnguRaptor page';
	});

});

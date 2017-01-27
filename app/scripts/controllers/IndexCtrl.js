'use strict';
define(['AnguRaptor', 'directives/navbar', 'directives/rawr-button', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('IndexCtrl', ['$scope', 'api', function($scope, api) {

        var index = {
            isLoggedIn: api.user.isLoggedIn()
        };

        var sessionListener = $scope.$on('session.change', function() {
            index.isLoggedIn = api.user.isLoggedIn();
        }, true);

        $scope.$on('$destroy', sessionListener);

				$scope.index = index;
				
    }]);

});

'use strict';
define(['AnguRaptor', 'directives/navbar', 'directives/rawr-button', 'services/api', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('IndexCtrl', ['$scope', 'api', 'PageTitleService', function($scope, api, PageTitleService) {

        var index = {
            isLoggedIn: null
        };

        api.user.isLoggedIn().then(function(loggedIn) {
            index.isLoggedIn = loggedIn;
        });

        var sessionListener = $scope.$on('session.change', function() {
            api.user.isLoggedIn().then(function(loggedIn) {
                index.isLoggedIn = loggedIn;
            });
        }, true);

        $scope.$on('$destroy', sessionListener);

				$scope.index = index;

    }]);

});

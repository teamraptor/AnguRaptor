'use strict';
define(['AnguRaptor', 'services/api', 'directives/user-box', 'directives/trending-box'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', function($scope, api) {

        var home = {
            user: null
        };

        api.user.get().then(function(user) {
            home.user = user;
        });

        $scope.home = home;

    }]);

});

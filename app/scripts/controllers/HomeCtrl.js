'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', function($scope, api) {

        if (api.user.isLoggedIn()) {
            api.user.get().then(function(user) {
                $scope.user = user;
            });
        } else {
          $scope.user = null;
        }

        api.users.get('lsoncini').then(function(result) {
            console.log(result);
        });

        var sessionListener = $scope.$on('session.change', function() {
            if (api.user.isLoggedIn()) {
                api.user.get().then(function(user) {
                    $scope.user = user;
                });
            } else {
              $scope.user = null;
            }
        }, true);

        $scope.$on('$destroy', sessionListener);

        $scope.login = function() {
            api.user.login('tomi', '147852').then(function(response) {

            });
        };

        $scope.logout = function() {
            api.user.logout().then(function() {

            });
        };

    }]);

});

'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('UserBoxCtrl', ['$scope', 'api', function($scope, api) {

        var userBox = {

        };

        userBox.followingStatusChanged = function(newStatus) {
            switch (newStatus) {
                case 'follow':
                    $scope.user.user_follows = true;
                    api.users.follow($scope.user.username);
                    break;

                case 'unfollow':
                    $scope.user.user_follows = false;
                    api.users.unfollow($scope.user.username);
                    break;
                default:
                    break;
            }
        };

        $scope.userBox = userBox;

    }]);

});

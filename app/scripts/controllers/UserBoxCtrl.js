'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.controller('UserBoxCtrl', ['$scope', function($scope) {

        var userBox = {

        };

        userBox.followingStatusChanged = function(newStatus) {
            switch (newStatus) {
                case 'follow':
                    $scope.user.user_follows = true;
                    $scope.followCallback($scope.user);
                    break;

                case 'unfollow':
                    $scope.user.user_follows = false;
                    $scope.unfollowCallback($scope.user);
                    break;
                default:
                    break;
            }
        };

        $scope.userBox = userBox;

    }]);

});

'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.controller('UserBoxCtrl', ['$scope', function($scope) {

        var userBox = {

        };

        userBox.followingStatusChanged = function(newStatus) {
            switch (newStatus) {
                case 'follow':
                    $scope.user.user_follows = true;
                    $scope.followCallback(user);
                    break;

                case 'unfollow':
                    $scope.user.user_follows = false;
                    $scope.unfollowCallback(user);
                    break;

            }
        };

        $scope.userBox = userBox;

    }]);

});

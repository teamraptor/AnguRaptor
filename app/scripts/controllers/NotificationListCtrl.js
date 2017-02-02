'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.controller('NotificationListCtrl', ['$scope', '$location', function($scope, $location) {

        var notificationList = {};

        var itemRef = function(notification) {
          switch (notification.type) {
            case 'mention':
            case 'like':
            case 'rerawr':
              return '/rawrs/' + '10012310'; // notification.status_id;
            case 'follow':
            case 'unfollow':
              return '/profile/' + notification.user.username;
            default:
              break;
          }
        };

        notificationList.notificationPressed = function(notification) {
            var path = itemRef(notification);
            if (path) {
              $location.url(itemRef(notification));
            }
        };

        $scope.notificationList = notificationList;

    }]);

});

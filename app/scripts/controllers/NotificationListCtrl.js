'use strict';
define(['AnguRaptor', 'services/api', 'services/DateService'], function(AnguRaptor) {

    AnguRaptor.controller('NotificationListCtrl', ['$scope', 'api', 'DateService', function($scope, api, DateService) {

        var notificationList = {
            items: [],
            busy: false,
            page: 1,
            fetchLimit: 5,
            disabled: false
        };

        notificationList.nextPage = function() {
            if (notificationList.busy) {
              return;
            }
            notificationList.busy = true;
            api.user.notifications.get(notificationList.page, notificationList.fetchLimit).then(function(notifications) {
                if (notifications.length < notificationList.fetchLimit) {
                    notificationList.disabled = true;
                }

                var last = notificationList.items[notificationList.items.length - 1];
                for (var i = 0; i < notifications.length; i++) {
                    notifications[i].created_time = DateService.calculateDateDifference(notifications[i].created_time);
                    notificationList.items.push(notifications[i]);
                }

                notificationList.page++;
                notificationList.busy = false;
                
            }).catch(function(error) {
                notificationList.busy = false;
                notificationList.disabled = true;
            });
        };

        notificationList.nextPage();

        $scope.notificationList = notificationList;

    }]);

});

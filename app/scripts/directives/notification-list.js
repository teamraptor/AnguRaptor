'use strict';
define(['AnguRaptor', 'controllers/NotificationListCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('notificationList', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/notification-list.html',
            controller: 'NotificationListCtrl',
            scope: {
                notifications: '=',
                isLoading: '=',
                disabled: '=',
                nextPage: '&'
            }
        };
    });

});

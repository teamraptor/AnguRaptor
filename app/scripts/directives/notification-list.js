'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.directive('notificationList', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/notification-list.html',
            scope: {
              notifications: '=',
              isLoading: '=',
              disabled: '=',
              nextPage: '&'
            }
        };
    });

});

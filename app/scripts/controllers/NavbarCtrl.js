'use strict';
define(['AnguRaptor', 'directives/notification-list', 'services/DateService', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('NavbarCtrl', ['$scope', 'api', '$window', 'DateService', function($scope, api, $window, DateService) {

        var navbar = {
            user: null,
            loggedIn: false,
            loginDetails: {}
        };

        navbar.login = function() {
            api.user.login(navbar.loginDetails.username, navbar.loginDetails.password).then(function() {
                navbar.loginDetails = {};
            });
        };

        navbar.logout = function() {
            api.user.logout().then(function() {

            });
        };

        if (api.user.isLoggedIn()) {
            api.user.get().then(function(user) {
                navbar.user = user;
                navbar.loggedIn = true;
            });
        } else {
            navbar.user = null;
            navbar.loggedIn = false;
        }

        var notificationList = {
            items: [],
            busy: false,
            page: 1,
            fetchLimit: 2,
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

                for (var i = 0; i < notifications.length; i++) {
                    notifications[i].created_time = DateService.calculateDateDifference(notifications[i].created_time);
                    notificationList.items.push(notifications[i]);
                }

                notificationList.page++;
                notificationList.busy = false;

            }).catch(function() {
                notificationList.busy = false;
                notificationList.disabled = true;
            });
        };

        notificationList.nextPage();

        navbar.notificationList = notificationList;

        $scope.navbar = navbar;

        var sessionListener = $scope.$on('session.change', function() {
            if (api.user.isLoggedIn()) {
                api.user.get().then(function(user) {
                    navbar.user = user;
                    navbar.loggedIn = true;
                });
            } else {
                navbar.user = null;
                navbar.loggedIn = false;
            }
        }, true);

        $scope.$on('$destroy', sessionListener);

    }]);

});

'use strict';
define(['AnguRaptor', 'directives/notification-list', 'directives/rawr-composer', 'services/DateService', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('NavbarCtrl', ['$scope', 'api', '$window', '$location', 'DateService', '$interval', function($scope, api, $window, $location, DateService, $interval) {

        var navbar = {
            user: null,
            loggedIn: false,
            loginDetails: {},
            notificationsOpen: false,
            searchField: ''
        };

        navbar.login = function() {
            api.user.login(navbar.loginDetails.username, navbar.loginDetails.password);
        };

        navbar.logout = function() {
            api.user.logout();
        };

        navbar.postRawr = function(status) {
            console.log(status);
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

        navbar.search = function(term) {
            $location.path('/search').search('term', term);
            navbar.searchField = '';
        };

        var notificationList = {
            items: [],
            busy: false,
            max_position: null,
            fetchLimit: 15,
            badge: 0,
            disabled: false
        };

        notificationList.fetch = function() {
            if (notificationList.busy) {
                return;
            }
            notificationList.busy = true;
            api.user.notifications.get(notificationList.fetchLimit, notificationList.max_position).then(function(notifications) {
                if (notifications.length < notificationList.fetchLimit) {
                    notificationList.disabled = true;
                }

                for (var i = 0; i < notifications.length; i++) {
                    notificationList.badge += notifications[i].new ? 1 : 0;
                    notificationList.items.push(notifications[i]);
                }

                notificationList.max_position = notifications[notifications.length - 1].created_time;
                notificationList.busy = false;

            }).catch(function() {
                notificationList.busy = false;
                notificationList.disabled = true;
            });
        };

        /*notificationList.interval = $interval(function() {
          var min_position = null;
          if (notificationList.items) {
            min_position = notificationList.items[0].created_time;
          }
          api.user.notifications.get(notificationList.fetchLimit, null, min_position).then(function(notifications) {
            notificationList.badge += notifications.length;
            notificationList.items = notifications.concat(notificationList.items);
            console.log(notificationList);
          });
        }, 5000);*/

        notificationList.fetch();

        navbar.notificationList = notificationList;

        navbar.toggleNotifications = function() {
            if (navbar.notificationsOpen) { // closing
              var ids = [];
              for (var i = 0; i < notificationList.items.length; i++) {
                  notificationList.items[i].new = false;
                  ids.push(notificationList.items[i].id);
              }
              if (ids.length > 0) {
                  api.user.notifications.markRead(ids);
              }
            } else {                        // opening
              notificationList.badge = 0;
            }
            navbar.notificationsOpen = !navbar.notificationsOpen;
        };

        $scope.navbar = navbar;

        var sessionListener = $scope.$on('session.change', function() {
            $window.location.reload();
        }, true);

        $scope.$on('$destroy', sessionListener);
        $scope.$on('$destroy', function() {
            $interval.cancel(notificationList.interval);
        });

    }]);

});

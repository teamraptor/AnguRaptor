'use strict';
define(['AnguRaptor', 'directives/notification-list', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('NavbarCtrl', ['$scope', 'api', function($scope, api) {

        var navbar = {
            user: null,
            loggedIn: false,
            loginDetails: {}
        };

        navbar.login = function() {
            api.user.login(navbar.loginDetails.username, navbar.loginDetails.password).then(function(response) {

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

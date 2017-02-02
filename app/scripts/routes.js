'use strict';

define([], function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: '/views/home.html',
                controller: 'HomeCtrl'
            },
            '/profile/:username': {
                templateUrl: '/views/profile.html',
                controller: 'ProfileCtrl',
                title: 'Profile'
            },
            '/search': {
                templateUrl: '/views/search.html',
                controller: 'SearchCtrl',
                title: 'Raptor Search'
            },
            '/rawrs/:rawr_id': {
                templateUrl: '/views/rawr.html',
                controller: 'RawrCtrl'
            }
            /* ===== yeoman hook ===== */
            /* Do not remove these commented lines! Needed for auto-generation */
        }
    };
});

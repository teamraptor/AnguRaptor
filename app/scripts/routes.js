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
                controller: 'ProfileCtrl'
            },
            '/search': {
                templateUrl: '/views/search.html',
                controller: 'SearchCtrl'
            }
            /* ===== yeoman hook ===== */
            /* Do not remove these commented lines! Needed for auto-generation */
        }
    };
});

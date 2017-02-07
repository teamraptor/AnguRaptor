'use strict';

define([], function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: './views/home.html',
                controller: 'HomeCtrl'
            },
            '/profile/:username': {
                templateUrl: './views/profile.html',
                controller: 'ProfileCtrl',
                title: 'Profile'
            },
            '/profile/:username/followers': {
                templateUrl: './views/followers.html',
                controller: 'FollowersCtrl',
                title: 'Followers'
            },
            '/profile/:username/following': {
                templateUrl: './views/following.html',
                controller: 'FollowingCtrl',
                title: 'Following'
            },
            '/search': {
                templateUrl: './views/search.html',
                controller: 'SearchCtrl',
                title: 'Raptor Search'
            },
            '/rawrs/:rawr_id': {
                templateUrl: './views/rawr.html',
                controller: 'RawrCtrl'
            },
            '/signup': {
                templateUrl: './views/signup.html',
                controller: 'SignupCtrl',
                authLevel: 'notAuthenticated'
            }
            /* ===== yeoman hook ===== */
            /* Do not remove these commented lines! Needed for auto-generation */
        }
    };
});

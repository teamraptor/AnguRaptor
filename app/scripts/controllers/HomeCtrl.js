'use strict';
define(['AnguRaptor', 'services/api', 'directives/user-box', 'directives/trending-box', 'directives/rawr-list'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', function($scope, api) {

        var home = {
            user: null
        };

        api.user.get().then(function(user) {
            home.user = user;
        });

        var rawrList = {};

        rawrList.items = [{
            title: 'Feed',
            nextPage: api.user.feed.get
        }, {
            title: 'Global',
            nextPage: api.feed.get
        }];

        home.rawrList = rawrList;

        $scope.home = home;

    }]);

});

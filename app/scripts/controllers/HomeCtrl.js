'use strict';
define(['AnguRaptor', 'services/api', 'directives/trending-box', 'directives/rawr-list'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', '$translate', function($scope, api, $translate) {

        var home = {};

        var rawrList = {};

        rawrList.items = [{
            title: 'Feed',
            nextPage: api.user.feed.get
        }, {
            title: 'Global',
            nextPage: api.feed.get
        }];

        $translate(['FEED_TITLE', 'GLOBAL_TITLE']).then(function(translations) {
            rawrList.items[0].title = translations.FEED_TITLE;
            rawrList.items[1].title = translations.GLOBAL_TITLE;
        });

        home.rawrList = rawrList;

        $scope.home = home;

    }]);

});

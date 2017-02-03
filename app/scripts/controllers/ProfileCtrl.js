'use strict';

define(['AnguRaptor', 'services/api', 'directives/user-box', 'directives/trending-box', 'directives/rawr-list', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('ProfileCtrl', ['$scope', '$routeParams', 'api', '$translate', 'PageTitleService', function($scope, $routeParams, api, $translate, PageTitleService) {

        var profile = {
            user: null,
            busy: false,
            userDoesNotExist: false
        };

        profile.busy = true;
        api.users.get($routeParams.username).then(function(user) {
            profile.user = user;
            profile.busy = false;
            PageTitleService.setTitle('' + user.first_name + ' ' + user.last_name + ' (@' + user.username + ')');
        }).catch(function() {
            profile.busy = false;
            profile.userDoesNotExist = true;
            PageTitleService.setTitle(':(');
        });

        var rawrList = {};

        var timelineWrapper = function(page, limit) {
          return api.users.timeline.get($routeParams.username, page, limit);
        };

        var mentionsWrapper = function(page, limit) {
          return api.users.mentions.get($routeParams.username, page, limit);
        };

        var favoritesWrapper = function(page, limit) {
          return api.users.likes.get($routeParams.username, page, limit);
        };

        rawrList.items = [{
            title: 'Timeline',
            nextPage: timelineWrapper
        }, {
            title: 'Mentions',
            nextPage: mentionsWrapper
        }, {
            title: 'Likes',
            nextPage: favoritesWrapper
        }];

        $translate(['TIMELINE_TITLE', 'MENTIONS_TITLE', 'FAVORITES_TITLE']).then(function(translations) {
            rawrList.items[0].title = translations.TIMELINE_TITLE;
            rawrList.items[1].title = translations.MENTIONS_TITLE;
            rawrList.items[2].title = translations.FAVORITES_TITLE;
        });

        profile.rawrList = rawrList;

        $scope.profile = profile;

    }]);

});

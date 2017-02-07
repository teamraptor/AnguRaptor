'use strict';
define(['AnguRaptor', 'services/api', 'directives/user-list', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('FollowersCtrl', ['$scope', 'api', '$routeParams', 'PageTitleService', '$translate', function($scope, api, $routeParams, PageTitleService, $translate) {

        var followers = {
          username: $routeParams.username ? $routeParams.username : '',
          items: []
        };

        followers.items.push({
            nextPage: function(page, limit) {
              return api.users.followers.get(followers.username, page, limit);
            }
        });

        $translate('FOLLOWERS_TITLE', {
            username: '@' + followers.username
        }).then(function(translated) {
            followers.items[0].title = translated;
        });

        PageTitleService.setTranslatedTitle('FOLLOWERS_TITLE', {username: '@' + followers.username});

        $scope.followers = followers;

    }]);

});

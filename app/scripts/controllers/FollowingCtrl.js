'use strict';
define(['AnguRaptor', 'services/api', 'directives/user-list', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('FollowingCtrl', ['$scope', 'api', '$routeParams', 'PageTitleService', '$translate', function($scope, api, $routeParams, PageTitleService, $translate) {

        var following = {
          username: $routeParams.username ? $routeParams.username : '',
          items: []
        };

        following.items.push({
            nextPage: function(page, limit) {
              return api.users.following.get(following.username, page, limit);
            }
        });

        $translate('FOLLOWING_TITLE', {
            username: '@' + following.username
        }).then(function(translated) {
            following.items[0].title = translated;
        });

        PageTitleService.setTranslatedTitle('FOLLOWING_TITLE', {username: '@' + following.username});

        $scope.following = following;

    }]);

});

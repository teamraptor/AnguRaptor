'use strict';
define(['AnguRaptor', 'services/api', 'directives/trending-box', 'directives/rawr-list', 'directives/user-list', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('SearchCtrl', ['$scope', 'api', '$routeParams', 'PageTitleService', '$translate', function($scope, api, $routeParams, PageTitleService, $translate) {

        var search = {
            term: $routeParams.term ? $routeParams.term : '',
            type: '',
            items: []
        };

        var queryBuilder = function(fn, term) {
          return function(page, limit) {
            return fn(term, page, limit);
          };
        };

        switch (search.term.charAt(0)) {
          case '#':
            search.bareTerm = search.term.substring(1);
            search.type = 'rawrs';
            search.items.push({
                nextPage: queryBuilder(api.search.hashtags.find, search.bareTerm)
            });
            break;
          case '@':
            search.bareTerm = search.term.substring(1);
            search.type = 'users';
            search.items.push({
                nextPage: queryBuilder(api.search.users.find, search.bareTerm)
            });
            break;
          default:
            search.bareTerm = search.term;
            search.type = 'rawrs';
            search.items.push({
                nextPage: queryBuilder(api.search.rawrs.find, search.bareTerm)
            });
        }

        $translate('SEARCH_TITLE', {term: search.term}).then(function(translated) {
            search.items[0].title = translated;
        });

        PageTitleService.setTranslatedTitle('PAGE_SEARCH_TITLE', {term: search.term});

        $scope.search = search;

    }]);

});

'use strict';
define(['AnguRaptor', 'services/api', 'directives/trending-box', 'directives/rawr-list', 'directives/user-box'], function(AnguRaptor) {

    AnguRaptor.controller('SearchCtrl', ['$scope', 'api', '$routeParams', 'DateService', function($scope, api, $routeParams, DateService) {
      
        var search = {
            term: $routeParams.term,
            busy: false,
            page: 1,
            fetchLimit: 15,
            disabled: false,
            results: []
        };

        search.nextPage = function() {

            if (search.busy) {
                return;
            }

            search.busy = true;
            api.search.find(search.term, search.page, search.fetchLimit).then(function(results) {

                if (results.data.length < results.data.fetchLimit) {
                    search.disabled = true;
                }

                for (var i = 0; i < results.data.length; i++) {
                    switch (results.type) {
                        case 'rawrs':
                            results.data[i].created_time = DateService.calculateDateDifference(results.data[i].created_time);
                            break;
                        default:
                            break;
                    }

                    search.results.push(results.data[i]);
                }

                search.type = results.type;
                search.page++;
                search.busy = false;

            }).catch(function() {
                search.busy = false;
                search.disabled = true;
            });

        };

        $scope.search = search;

    }]);

});

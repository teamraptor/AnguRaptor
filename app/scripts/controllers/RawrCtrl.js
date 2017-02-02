'use strict';
define(['AnguRaptor', 'services/api', 'directives/rawr-list'], function(AnguRaptor) {

    AnguRaptor.controller('RawrCtrl', ['$scope', 'api', '$routeParams', function($scope, api, $routeParams) {

        var rawrItem = {
            title: 'Rawr',
            disabled: true,
            rawrs: []
        };

        api.rawr.get($routeParams.rawr_id).then(function(rawr) {
            rawrItem.rawrs.push(rawr);
            $scope.rawrItems = [rawrItem];
        });

        $scope.rawrItems = [rawrItem];

    }]);

});

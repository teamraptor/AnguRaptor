'use strict';
define(['AnguRaptor', 'directives/rawr-composer', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('RawrButtonCtrl', ['$scope', 'api', function($scope, api) {

        var rawrMobile = {
          opened: false
        };

        rawrMobile.open = function() {
          rawrMobile.opened = true;
        };

        rawrMobile.close = function() {
          rawrMobile.opened = false;
        };

        rawrMobile.postRawr = function(status) {
            rawrMobile.close();
            console.log(status);
        };

        $scope.rawrMobile = rawrMobile;

    }]);

});

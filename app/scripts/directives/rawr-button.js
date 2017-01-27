'use strict';

define(['AnguRaptor', 'controllers/RawrButtonCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('rawrButton', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/rawr-button.html',
            controller: 'RawrButtonCtrl'
        };
    });

});

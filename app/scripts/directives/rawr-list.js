'use strict';
define(['AnguRaptor', 'controllers/RawrListCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('rawrList', function() {
        return {
            restrict: 'E',
            templateUrl: './views/rawr-list.html',
            controller: 'RawrListCtrl',
            scope: {
              items: '='
            }
        };
    });

});

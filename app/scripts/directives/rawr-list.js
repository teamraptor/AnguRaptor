'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.directive('rawrList', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/rawr-list.html',
            scope: {
              rawrs: '=',
              header: '=',
              isLoading: '=',
              disabled: '=',
              nextPage: '&'
            }
        };
    });

});

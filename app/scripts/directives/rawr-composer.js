'use strict';
define(['AnguRaptor', 'controllers/RawrComposerCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('rawrComposer', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/rawr-composer.html',
            controller: 'RawrComposerCtrl',
            scope: {
              postCallback: '&'
            }
        };
    });

});

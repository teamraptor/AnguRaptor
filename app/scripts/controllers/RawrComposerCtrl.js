'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.controller('RawrComposerCtrl', ['$scope', function($scope) {

          var rawrComposer = {
            status: $scope.initialStatus || ''
          };

          rawrComposer.postRawr = function() {
            $scope.postCallback({status: rawrComposer.status, arg: $scope.callbackArg});
            rawrComposer.status = '';
          };
          
          $scope.rawrComposer = rawrComposer;

    }]);

});

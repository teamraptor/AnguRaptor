'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.controller('RawrComposerCtrl', ['$scope', function($scope) {

          var rawrComposer = {
            status: ''
          };

          rawrComposer.postRawr = function() {
            $scope.postCallback({status: rawrComposer.status});
            rawrComposer.status = '';
          };

          $scope.rawrComposer = rawrComposer;

    }]);

});

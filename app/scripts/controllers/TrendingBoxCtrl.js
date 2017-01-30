'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('TrendingBoxCtrl', ['$scope', 'api', function($scope, api) {

      var trendingBox = {
        trends: [],
        busy: false
      };

      trendingBox.busy = true;
      api.trends.get().then(function(trends) {
        trendingBox.trends = trends;
        trendingBox.busy = false;
      });

      $scope.trendingBox = trendingBox;

    }]);

});

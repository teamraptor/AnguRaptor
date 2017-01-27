'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

    AnguRaptor.controller('TrendingBoxCtrl', ['$scope', 'api', function($scope, api) {

      var trendingBox = {
        trends: {}
      };

      api.trends.get().then(function(trends){
        trendingBox.trends = trends;
      });

      $scope.trendingBox = trendingBox;

    }]);

});

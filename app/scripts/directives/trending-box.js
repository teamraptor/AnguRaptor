'use strict';
define(['AnguRaptor', 'controllers/TrendingBoxCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('trendingBox', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/trending-box.html',
            controller: 'TrendingBoxCtrl'
        }
    });

});

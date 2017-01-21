'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

  AnguRaptor.controller('HomeCtrl', ['$scope', 'api', function($scope, api) {
    api.users.timeline.get('tomi', 1, 15).then(function(data) {
      $scope.homePageText = data;
			console.log(data);
    })
  }]);

});

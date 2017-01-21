'use strict';
define(['AnguRaptor', 'services/api'], function(AnguRaptor) {

  AnguRaptor.controller('HomeCtrl', ['$scope', 'api', function($scope, api) {
      $scope.isLoggedIn = api.user.isLoggedIn();
      $scope.$on('session.change', function(){
        console.log('changed');
        $scope.isLoggedIn = api.user.isLoggedIn();
      }, true);

      $scope.login = function() {
        api.user.login('tomi','147852').then(function(response){
            console.log('Logged in!');
        });
      }

      $scope.logout = function() {
        api.user.logout().then(function(){
            console.log('Logged out!');
        });
      }

  }]);

});

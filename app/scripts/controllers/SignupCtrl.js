'use strict';
define(['AnguRaptor', 'services/api', 'services/PageTitleService'], function(AnguRaptor) {

    AnguRaptor.controller('SignupCtrl', ['$scope', 'api', 'PageTitleService', function($scope, api, PageTitleService) {

        var signup = {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: ''
        };

        PageTitleService.setTranslatedTitle('SIGN_UP_TITLE');

        signup.createUser = function() {
          api.user.create(signup.firstName, signup.lastName, signup.username, signup.email, signup.password).catch(function(error) {

          });
        };

        $scope.signup = signup;

    }]);

});

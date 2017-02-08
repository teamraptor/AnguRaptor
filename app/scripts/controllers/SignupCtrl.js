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
            signup.error = false;
            api.user.create(signup.firstName, signup.lastName, signup.username, signup.email, signup.password).catch(function() {
                signup.error = true;
            });
        };

        $scope.signup = signup;

    }]);

});

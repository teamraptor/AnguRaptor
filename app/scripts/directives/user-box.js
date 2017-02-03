'use strict';
define(['AnguRaptor', 'controllers/UserBoxCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('userBox', function() {
        return {
            restrict: 'E',
            templateUrl: './views/user-box.html',
            controller: 'UserBoxCtrl',
            scope: {
                user: '='
            }
        };
    });

});

'use strict';
define(['AnguRaptor', 'controllers/NavbarCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('navbar', function() {
        return {
            restrict: 'E',
            templateUrl: './views/navbar.html',
            controller: 'NavbarCtrl'
        };
    });

});

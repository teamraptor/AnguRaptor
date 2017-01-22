define(['AnguRaptor', 'controllers/NavbarCtrl'], function(AnguRaptor) {

    'use strict';
    AnguRaptor.directive('navbar', function() {
        return {
            restrict: 'E',
            templateUrl: '../../views/navbar.html',
            controller: 'NavbarCtrl'
        }
    });

});

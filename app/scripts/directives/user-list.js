'use strict';
define(['AnguRaptor', 'controllers/UserListCtrl'], function(AnguRaptor) {

    AnguRaptor.directive('userList', function() {
        return {
            restrict: 'E',
            templateUrl: './views/user-list.html',
            controller: 'UserListCtrl',
            scope: {
              items: '='
            }
        };
    });

});

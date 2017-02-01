'use strict';
define(['AnguRaptor', 'directives/user-box'], function(AnguRaptor) {

    AnguRaptor.controller('UserListCtrl', ['$scope', function($scope) {

        var userList = {
            selected: 0,
            items: []
        };

        $scope.$watch('items', function() {
          userList.items = [];
          for (var i = 0; i < $scope.items.length; i++) {
              userList.items.push({
                  users: [],
                  busy: false,
                  page: 1,
                  fetchLimit: $scope.items[i].fetchLimit || 15,
                  nextPage: $scope.items[i].nextPage,
                  title: $scope.items[i].title,
                  disabled: false
              });
          }
        });

        userList.loadMore = function() {

            var item = userList.items[userList.selected];

            if (item.busy || item.disabled) {
                return;
            }

            item.busy = true;

            item.nextPage(item.page, item.fetchLimit).then(function(users) {
                if (users.length < item.fetchLimit) {
                    item.disabled = true;
                }

                for (var i = 0; i < users.length; i++) {
                    item.users.push(users[i]);
                }

                item.page++;
                item.busy = false;

            }).catch(function() {
                item.busy = false;
                item.disabled = true;
            });
        };

        userList.switchSelection = function(selected) {
            if (selected === userList.selected) {
                return;
            }
            userList.selected = selected;
            if (userList.items[selected].users.length === 0) {
                userList.loadMore();
            }
        };

        $scope.userList = userList;

    }]);

});

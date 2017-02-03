'use strict';
define(['AnguRaptor', 'services/api', 'filters/htmlize'], function(AnguRaptor) {

    AnguRaptor.controller('RawrListCtrl', ['$scope', 'api', '$interval', function($scope, api, $interval) {

        var rawrList = {
            selected: 0,
            items: []
        };

        var setListener = function(item) {
          item.cancelInterval = $interval(function() {
            fetchNew(item);
          }, item.interval);
        };

        var clearListeners = function() {
          angular.forEach(rawrList.items, function(item) {
            if (item.cancelInterval) {
              item.cancelInterval();
            }
          });
        };

        var fetchNew = function(item) {
          if (item.index !== rawrList.selected) {
            return;
          };
          var last = (item.newRawrs.length === 0) ? (item.rawrs[0].created_time) : (item.newRawrs[0].created_time);
          item.nextPage(1, item.fetchLimit, last).then(function(newRawrs) {
            item.newRawrs = newRawrs.concat(item.newRawrs);
          });
        };

        var itemListener = $scope.$watch('items', function() {
          clearListeners();
          rawrList.items = [];
          for (var i = 0; i < $scope.items.length; i++) {

              rawrList.items.push({
                  index: i,
                  rawrs: $scope.items[i].rawrs || [],
                  newRawrs: [],
                  busy: false,
                  page: 1,
                  fetchLimit: $scope.items[i].fetchLimit || 15,
                  nextPage: $scope.items[i].nextPage,
                  title: $scope.items[i].title,
                  interval: $scope.items[i].interval,
                  disabled: $scope.items[i].disabled || false
              });

              if (rawrList.items[i].interval) {
                setListener(rawrList.items[i]);
              }
          }
        });

        rawrList.fetchOld = function() {

            var item = rawrList.items[rawrList.selected];

            if (item.busy || item.disabled) {
                return;
            }

            item.busy = true;

            item.nextPage(item.page, item.fetchLimit).then(function(rawrs) {
                if (rawrs.length < item.fetchLimit) {
                    item.disabled = true;
                }

                for (var i = 0; i < rawrs.length; i++) {
                    item.rawrs.push(rawrs[i]);
                }

                item.page++;
                item.busy = false;

            }).catch(function() {
                item.busy = false;
                item.disabled = true;
            });
        };

        rawrList.showNew = function() {

          var item = rawrList.items[rawrList.selected];

          item.rawrs = item.newRawrs.concat(item.rawrs);
          item.newRawrs = [];

        };

        rawrList.switchSelection = function(selected) {
            if (selected === rawrList.selected) {
                return;
            }
            rawrList.selected = selected;
            if (rawrList.items[selected].rawrs.length === 0) {
                rawrList.fetchOld();
            }
        };

        rawrList.like = function(rawr) {
            if (rawr.user_has_liked) {
              api.rawr.unlike(rawr.id);
              rawr.counts.likes--;
            } else {
              api.rawr.like(rawr.id);
              rawr.counts.likes++;
            }
            rawr.user_has_liked = !rawr.user_has_liked;
        };

        rawrList.rerawr = function(rawr) {
            if (rawr.user_has_rerawred) {
              api.rawr.unrerawr(rawr.id);
              rawr.counts.rerawrs--;
            } else {
              api.rawr.rerawr(rawr.id);
              rawr.counts.rerawrs++;
            }
            rawr.user_has_rerawred = !rawr.user_has_rerawred;
        };

        $scope.rawrList = rawrList;

        $scope.$on('$destroy', itemListener);
        $scope.$on('$destroy', clearListeners);

    }]);

});

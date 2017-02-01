'use strict';
define(['AnguRaptor', 'services/api', 'filters/htmlize'], function(AnguRaptor) {

    AnguRaptor.controller('RawrListCtrl', ['$scope', 'api', function($scope, api) {

        var rawrList = {
            selected: 0,
            items: []
        };

        for (var i = 0; i < $scope.items.length; i++) {
            rawrList.items.push({
                rawrs: [],
                busy: false,
                page: 1,
                fetchLimit: $scope.items[i].fetchLimit || 15,
                nextPage: $scope.items[i].nextPage,
                title: $scope.items[i].title,
                disabled: false
            });
        }

        rawrList.loadMore = function() {

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

        rawrList.switchSelection = function(selected) {
            if (selected === rawrList.selected) {
                return;
            }
            rawrList.selected = selected;
            if (rawrList.items[selected].rawrs.length === 0) {
                rawrList.loadMore();
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

    }]);

});

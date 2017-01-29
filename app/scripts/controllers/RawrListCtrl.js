'use strict';
define(['AnguRaptor', 'services/api', 'bootstrap'], function(AnguRaptor) {

    AnguRaptor.controller('RawrListCtrl', ['$scope', 'api', 'DateService', function($scope, api, DateService) {

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

            console.log('Selected:' + rawrList.selected + ', Page: ' + item.page);

            item.nextPage(item.page, item.fetchLimit).then(function(rawrs) {
                if (rawrs.length < item.fetchLimit) {
                    item.disabled = true;
                }

                for (var i = 0; i < rawrs.length; i++) {
                    rawrs[i].created_time = DateService.calculateDateDifference(rawrs[i].created_time);
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

        $scope.rawrList = rawrList;

    }]);

});

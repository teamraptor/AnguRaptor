'use strict';
define(['AnguRaptor', 'services/api', 'filters/htmlize', 'directives/rawr-composer'], function(AnguRaptor) {

    AnguRaptor.controller('RawrListCtrl', ['$scope', 'api', '$interval', function($scope, api, $interval) {

        var rawrList = {
            selected: 0,
            globalDisable: true,
            items: [],
            loggedIn: api.user.isLoggedIn(),
            intervals: []
        };

        var setInterval = function(item) {
            rawrList.intervals.push($interval(function() {
                fetchNew(item);
            }, item.interval));
        };

        var clearIntervals = function() {
            angular.forEach(rawrList.intervals, function(interval) {
                $interval.cancel(interval);
            });
        };

        var fetchNew = function(item) {
            var min_position = null;
            if (item.newRawrs.length === 0 && item.rawrs.length !== 0) { // there are no new items to be displayed
                min_position = item.rawrs[0].rerawr ? item.rawrs[0].rerawr.created_time : item.rawrs[0].created_time; // if its a rerawr, I fetch the rerawr time, if not the rawr time
            } else if (item.rawrs.length !== 0) {
                min_position = item.newRawrs[0].rerawr ? item.newRawrs[0].rerawr.created_time : item.newRawrs[0].created_time;
            }
            item.fetch(item.fetchLimit, null, min_position).then(function(newRawrs) {
                if (item.rawrs.length === 0) { // there are no items in the main rawr list, insert them here
                    item.rawrs = newRawrs;
                } else {
                    item.newRawrs = newRawrs.concat(item.newRawrs); // i add to the list of pending new rawrs, the ones just fetched
                }
            });
        };

        var itemListener = $scope.$watch('items', function() {
            clearIntervals();
            rawrList.items = [];
            rawrList.globalDisable = true;
            for (var i = 0; i < $scope.items.length; i++) {
                rawrList.items.push({
                    index: i,
                    rawrs: $scope.items[i].rawrs ||  [],
                    newRawrs: [],
                    busy: false,
                    max_position: null,
                    fetchLimit: $scope.items[i].fetchLimit || 15,
                    fetch: $scope.items[i].nextPage,
                    title: $scope.items[i].title,
                    interval: $scope.items[i].interval,
                    disabled: $scope.items[i].disabled ||  false
                });

                if (rawrList.items[i].interval) {
                    setInterval(rawrList.items[i]);
                }
            }
            if (rawrList.items.length > 0) {
                rawrList.globalDisable = false;
            }
        });

        rawrList.fetchOld = function() {
            var item = rawrList.items[rawrList.selected];

            if (item.busy || item.disabled) {
                return;
            }

            item.busy = true;

            item.fetch(item.fetchLimit, item.max_position, null).then(function(rawrs) {
                if (rawrs.length < item.fetchLimit) {
                    item.disabled = true;
                }

                for (var i = 0; i < rawrs.length; i++) {
                    item.rawrs.push(rawrs[i]);
                }

                var last = rawrs[rawrs.length - 1];
                if (last) {
                    item.max_position = last.rerawr ? last.rerawr.created_time : last.created_time; // the new max_position is the latest rawr in the response creation_time
                }
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
            console.log(rawr.user_has_liked);
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

        rawrList.toggleReply = function(item) {
            if (item.replyOpen == null || item.replyOpen === false) {
              item.replyOpen = true;
            } else {
              item.replyOpen = false;
            }
        };

        rawrList.postReply = function(status, item) {
          rawrList.toggleReply(item);
          api.rawr.create(status);
        };

        $scope.rawrList = rawrList;

        $scope.$on('$destroy', itemListener);
        $scope.$on('$destroy', clearIntervals);

    }]);

});

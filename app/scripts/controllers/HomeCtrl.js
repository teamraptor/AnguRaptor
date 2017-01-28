'use strict';
define(['AnguRaptor', 'services/api', 'directives/user-box', 'directives/trending-box', 'directives/rawr-list'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', 'DateService', function($scope, api, DateService) {

        var home = {
            user: null
        };

        api.user.get().then(function(user) {
            home.user = user;
        });

        var rawrList = {
            items: [],
            busy: false,
            page: 1,
            fetchLimit: 2,
            disabled: false
        };

        rawrList.header = [{
            title: 'Feed',
            link: 'www.google.com.ar',
            active: true
        }, {
            title: 'Global',
            link: 'www.facebook.com'
        }];

        rawrList.nextPage = function() {
            console.log('Mac');
            if (rawrList.busy) {
                return;
            }
            rawrList.busy = true;
            api.user.feed.get(rawrList.page, rawrList.fetchLimit).then(function(rawrs) {
                if (rawrs.length < rawrList.fetchLimit) {
                    rawrList.disabled = true;
                }

                for (var i = 0; i < rawrs.length; i++) {
                    rawrs[i].created_time = DateService.calculateDateDifference(rawrs[i].created_time);
                    rawrList.items.push(rawrs[i]);
                }

                rawrList.page++;
                rawrList.busy = false;

            }).catch(function() {
                rawrList.busy = false;
                rawrList.disabled = true;
            });
        };

        rawrList.nextPage();

        home.rawrList = rawrList;

        $scope.home = home;

    }]);

});

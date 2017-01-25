'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.service('DateService', function() {
        this.calculateDateDifference = function(date) {
            var now = new Date();
            var older = new Date(date);
            var dif = Math.abs(now.getTime() - older.getTime());

            var sec = dif / 1000;
            var min = sec / 60;
            var hours = min / 60;
            var days = hours / 24;

            var result = {};

            if (sec < 60) {
                result.number = 1;
                result.unit = 'minute';
            } else if (min < 60) {
                result.number = Math.floor(min);
                result.unit = (result.number === 1) ? 'minute' : 'minutes';
            } else if (hours < 24) {
                result.number = Math.floor(hours);
                result.unit = (result.number === 1) ? 'hour' : 'hours';
            } else {
                result.number = Math.floor(days);
                result.unit = (result.number === 1) ? 'day' : 'days';
            }

            return result;
        };
    });

});

'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.service('MediaService', function() {
        this.imageExtractor = function(rawr) {
            var IMAGE_URL_REGEX = /((https?:\/\/)|(www\.)[A-Za-z0-9._%+-]*)\S*[^\s.;,(){}<>"\u201d\u2019]\.(jpeg|jpg|gif|png)/i;
            rawr.imagesUrl = [];
            var raw = rawr.status;
            var match;
            var i;
            while ((match = raw.match(IMAGE_URL_REGEX))) {
                rawr.imagesUrl.push(match[0]);
                i = match.index;
                raw = raw.substring(i + match[0].length);
            }
            return rawr;
        };
        this.youtubeExtractor = function(rawr) {
            var YOUTUBE_URL_REGEX = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/i;
            rawr.youtubeIds = [];
            var raw = rawr.status;
            var match;
            var i;
            while ((match = raw.match(YOUTUBE_URL_REGEX))) {
                rawr.youtubeIds.push(match[1]);
                i = match.index;
                raw = raw.substring(i + match[1].length);
            }
            return rawr;
        };
        this.extractAll = function(rawr) {
            return this.imageExtractor(this.youtubeExtractor(rawr));
        };
    });

    AnguRaptor.filter('youtubeEmbedUrl', ['$sce', function($sce) {
        return function(videoId) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
        };
    }]);

});

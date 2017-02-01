'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.filter('newlines', ['$sanitize', function($sanitize) {
        var tag = (/xhtml/i).test(document.doctype) ? '<br />' : '<br>';
        return function(msg) {
            // ngSanitize's linky filter changes \r and \n to &#10; and &#13; respectively
            msg = (msg + '').replace(/(\r\n|\n\r|\r|\n|&#10;&#13;|&#13;&#10;|&#10;|&#13;)/g, tag + '$1');
            return $sanitize(msg);
        };
    }]);

    AnguRaptor.filter('myLinky', [function() {
      var LINKY_URL_REGEXP = /((https?:\/\/)|(www\.)[A-Za-z0-9._%+-]*)\S*[^\s.;,(){}<>"\u201d\u2019]/i;

      return function(text, target) {
        if (!text) {
          return text;
        }
        var match;
        var raw = text;
        var html = [];
        var url;
        var i;
        while ((match = raw.match(LINKY_URL_REGEXP))) {
          url = match[0];
          if (!match[2] && !match[4] && match[3]) {
            url = 'http://' + url;
          }
          i = match.index;
          addText(raw.substr(0, i));
          addLink(url, match[0]);
          raw = raw.substring(i + match[0].length);
        }
        addText(raw);
        return html.join('');

        function addText(text) {
          if (!text) {
            return;
          }
          html.push(text);
        }

        function addLink(url, text) {
          html.push('<a ');
          if (angular.isDefined(target)) {
            html.push('target="',
                      target,
                      '" ');
          }
          html.push('href="',
                    url.replace(/"/g, '&quot;'),
                    '">');
          addText(text);
          html.push('</a>');
        }
      };
    }]);

    AnguRaptor.filter('noImages', function() {
      return function(string) {
          var imagePattern = /((https?:\/\/)|(www\.)[A-Za-z0-9._%+-]*)\S*[^\s.;,(){}<>"\u201d\u2019]\.(jpeg|jpg|gif|png)/gim;
          return string.replace(imagePattern, '');
      };
    });

    AnguRaptor.filter('hashtags', function() {

        return function(string) {
            var hashtagPattern = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            return string.replace(hashtagPattern, ' <a href="#/search?term=%23$2">#$2</a>');
        };

    });

    AnguRaptor.filter('mentions', function() {

        return function(string) {
            var mentionsPattern = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            return string.replace(mentionsPattern, ' <a href="#/profile/$2">@$2</a>');
        };

    });

});

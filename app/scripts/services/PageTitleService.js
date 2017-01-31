'use strict';
define(['AnguRaptor'], function(AnguRaptor) {

    AnguRaptor.service('PageTitleService', ['$rootScope', '$window', '$translate', function($rootScope, $window, $translate) {

        var setTitle = function(title) {
            $window.document.title = title;
        };

        var getTitle = function() {
            return $window.document.title;
        };

        var setTranslatedTitle = function(translationId, parameters) {
            $translate(translationId, parameters).then(function(translated) {
                setTitle(translated);
            });
        };

        var destroyer = $rootScope.$on('$routeChangeSuccess', function(event, route) {
            var pageTitle;
            if (route && angular.isDefined(route.$$route)) {
                pageTitle = route.$$route.title || null;
            }
            setTitle(pageTitle);
        });

        $rootScope.$on('$destroy', destroyer);

        this.setTitle = setTitle;
        this.getTitle = getTitle;
        this.setTranslatedTitle = setTranslatedTitle;

    }]);

});

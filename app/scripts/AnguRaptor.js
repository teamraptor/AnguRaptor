'use strict';
define(['routes',
        'services/dependencyResolverFor',
        'i18n/i18nLoader!',
        'angular',
        'angular-route',
        'bootstrap',
        'angular-translate',
        'angular-cookies',
        'angular-local-storage',
        'angular-sanitize',
        'infinite-scroll'
    ],
    function(config, dependencyResolverFor, i18n) {
        var AnguRaptor = angular.module('AnguRaptor', [
            'ngRoute',
            'pascalprecht.translate',
            'ngCookies',
            'infinite-scroll',
            'LocalStorageModule',
            'ngSanitize'
        ]);

        AnguRaptor
        .config(['$routeProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$translateProvider', 'localStorageServiceProvider',
             function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $translateProvider, localStorageServiceProvider) {

              AnguRaptor.controller = $controllerProvider.register;
              AnguRaptor.directive = $compileProvider.directive;
              AnguRaptor.filter = $filterProvider.register;
              AnguRaptor.factory = $provide.factory;
              AnguRaptor.service = $provide.service;

              localStorageServiceProvider.setPrefix('raptor');

              if (config.routes !== undefined) {
                  angular.forEach(config.routes, function(route, path) {
                      $routeProvider.when(path, {
                          templateUrl: route.templateUrl,
                          resolve: dependencyResolverFor(['controllers/' + route.controller]),
                          controller: route.controller,
                          gaPageTitle: route.gaPageTitle,
                          title: route.title || 'Raptor',
                          authLevel: route.authLevel  || 'same'
                      });
                  });
              }
							
              if (config.defaultRoutePath !== undefined) {
                  $routeProvider.otherwise({
                      redirectTo: config.defaultRoutePath
                  });
              }

              $translateProvider.translations('preferredLanguage', i18n);
              $translateProvider.preferredLanguage('preferredLanguage');

          }]).run(['$rootScope', '$location', 'api', function($rootScope, $location, api) {

							$rootScope.$on('$routeChangeStart', function(event, toState) {

								if (toState.$$route.authLevel !== 'same') {
										if ((api.user.isLoggedIn() && toState.$$route.authLevel === 'notAuthenticated') ||  (api.user.isLoggedIn() && toState.$$route.authLevel === 'authenticated')) {
												event.preventDefault();
												$location.path('/');
										}
								}

							});
        }]);

        return AnguRaptor;
    }
);

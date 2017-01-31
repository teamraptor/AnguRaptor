'use strict';
define(['routes',
	'services/dependencyResolverFor',
	'i18n/i18nLoader!',
	'angular',
	'angular-route',
	'bootstrap',
	'angular-translate',
	'angular-cookies',
	'infinite-scroll'],
	function(config, dependencyResolverFor, i18n) {
		var AnguRaptor = angular.module('AnguRaptor', [
			'ngRoute',
			'pascalprecht.translate',
			'ngCookies',
			'infinite-scroll'
		]);
		AnguRaptor
			.config(
				['$routeProvider',
				'$controllerProvider',
				'$compileProvider',
				'$filterProvider',
				'$provide',
				'$translateProvider',
				function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $translateProvider) {

					AnguRaptor.controller = $controllerProvider.register;
					AnguRaptor.directive = $compileProvider.directive;
					AnguRaptor.filter = $filterProvider.register;
					AnguRaptor.factory = $provide.factory;
					AnguRaptor.service = $provide.service;

					if (config.routes !== undefined) {
						angular.forEach(config.routes, function(route, path) {
							$routeProvider.when(path, {templateUrl: route.templateUrl, resolve: dependencyResolverFor(['controllers/' + route.controller]), controller: route.controller, gaPageTitle: route.gaPageTitle, title: (route.title || 'Raptor')});
						});
					}
					if (config.defaultRoutePath !== undefined) {
						$routeProvider.otherwise({redirectTo: config.defaultRoutePath});
					}

					$translateProvider.translations('preferredLanguage', i18n);
					$translateProvider.preferredLanguage('preferredLanguage');
				}]);
		return AnguRaptor;
	}
);

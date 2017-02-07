'use strict';

define(['AnguRaptor', 'services/DateService', 'services/MediaService', 'angular-local-storage'], function(AnguRaptor) {

    var root = 'http://localhost:8080';
    // var root = 'http://10.0.1.6:8080';

    AnguRaptor.service('api', ['$http', '$q', 'localStorageService', '$window', '$rootScope', 'DateService', 'MediaService', function($http, $q, localStorageService, $window, $rootScope, DateService, MediaService) {

        var hasCredentials = (localStorageService.get('credentials') == null) ? false : true;

        function endpoint(options) {
            options.url = root + options.url;
            options.after = options.after || function(data) {
                return data;
            };
            options.afterError = options.afterError || function(data) {
                return data;
            };
            options.headers = options.headers  ||  {};
            options.method = options.method || 'GET';
            options.body = options.body ||  {};

            var headers = {
                'Content-Type': 'application/json'
            };

            var credentials = localStorageService.get('credentials');

            if (credentials) {
                headers.Authorization = 'Basic ' + credentials;
            }

            var httpConfig = {
                url: options.url,
                method: options.method,
                params: options.params,
                data: options.body,
                'headers': headers
            };

            if (options.transformRequest) {
                httpConfig.transformRequest = options.transformRequest;
            }

            return $http(httpConfig).then(function(response) {
                return options.after(response.data, response.headers);
            }).catch(function(response) {
                var error = {
                    'code': response.status,
                    'message': response.statusText
                };
                return $q.reject(options.afterError({
                    'error': error,
                    'data': response.data
                }));
            });

        };

        function buildSession() {
            hasCredentials = true;
            $rootScope.$broadcast('session.change');
        }

        function loginError(error) {
            localStorageService.remove('credentials');
            return error;
        }

        function buildRawr(rawr) {
            rawr.time = DateService.calculateDateDifference(rawr.created_time);
            rawr.images = MediaService.extractAll(rawr);
            return rawr;
        }

        function buildRawrList(rawrList) {
            angular.forEach(rawrList, function(rawr) {
                buildRawr(rawr);
            });
            return rawrList;
        }

        function buildNotification(notification) {
            notification.time = DateService.calculateDateDifference(notification.created_time);
            return notification;
        }

        function buildNotifications(notifications) {
            angular.forEach(notifications, function(notification) {
                buildNotification(notification);
            });
            return notifications;
        }

        this.user = {
            get: function() {
                return endpoint({
                    url: '/user'
                });
            },
            login: function(username, password) {
                localStorageService.set('credentials', btoa(username + ':' + password));
                return endpoint({
                    url: '/user',
                    method: 'HEAD',
                    after: buildSession,
                    afterError: loginError
                });
            },
            logout: function() {
                hasCredentials = false;
                localStorageService.remove('credentials');
                $rootScope.$broadcast('session.change');
            },
            create: function(firstName, lastName, useranme, email, password) {
                return endpoint({
                    url: '/signup',
                    method: 'POST',
                    body: {
                        'first_name': firstName,
                        'last_name': lastName,
                        'username': username,
                        'email': email,
                        'password': password
                    }
                });
            },
            isLoggedIn: function() {
                return hasCredentials;
            }
        };

        this.user.feed = {
            get: function(limit, max_position, min_position) {
                return endpoint({
                    url: '/user/feed',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.user.notifications = {
            get: function(limit, max_position, min_position) {
                return endpoint({
                    url: '/user/notifications',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildNotifications
                });
            },
            unreadCount: function() {
                return endpoint({
                    url: '/user/notifications/count'
                });
            },
            markRead: function(notificationIds) {
                return endpoint({
                    url: '/user/notifications/read',
                    method: 'POST',
                    body: notificationIds
                });
            }
        };

        this.users = {
            get: function(username) {
                return endpoint({
                    url: '/users/' + username
                });
            },
            follow: function(username) {
                return endpoint({
                    url: '/users/' + username + '/follow',
                    method: 'POST'
                });
            },
            unfollow: function(useranme) {
                return endpoint({
                    url: '/users/' + useranme + '/unfollow',
                    method: 'POST'
                });
            }
        };

        this.users.followers = {
            get: function(username, page, limit) {
                return endpoint({
                    url: '/users/' + username + '/followers',
                    params: {
                        'limit': limit,
                        'page': page
                    }
                });
            }
        };

        this.users.following = {
            get: function(username, page, limit) {
                return endpoint({
                    url: '/users/' + username + '/following',
                    params: {
                        'limit': limit,
                        'page': page
                    }
                });
            }
        };

        this.users.timeline = {
            get: function(username, limit, max_position, min_position) {
                return endpoint({
                    url: '/users/' + username + '/timeline',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.users.mentions = {
            get: function(username, limit, max_position, min_position) {
                return endpoint({
                    url: '/users/' + username + '/mentions',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.users.likes = {
            get: function(username, limit, max_position, min_position) {
                return endpoint({
                    url: '/users/' + username + '/likes',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.feed = {
            get: function(limit, max_position, min_position) {
                return endpoint({
                    url: '/feed',
                    params: {
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.trends = {
            get: function() {
                return endpoint({
                    url: '/trending?count=10'
                });
            }
        };

        this.search = {};

        this.search.rawrs = {
            find: function(term, limit, max_position, min_position) {
                return endpoint({
                    url: '/search/rawrs',
                    params: {
                        'term': term,
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.search.users = {
            find: function(term, page, limit) {
                return endpoint({
                    url: '/search/users',
                    params: {
                        'term': term,
                        'page': page,
                        'limit': limit
                    }
                });
            }
        };

        this.search.hashtags = {
            find: function(term, limit, max_position, min_position) {
                return endpoint({
                    url: '/search/hashtags',
                    params: {
                        'term': term,
                        'limit': limit,
                        'max_position': max_position,
                        'min_position': min_position
                    },
                    after: buildRawrList
                });
            }
        };

        this.rawr = {
            get: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId,
                    after: buildRawr
                });
            },
            create: function(status) {
                return endpoint({
                    url: '/rawrs',
                    method: 'POST',
                    body: {
                        'status': status
                    }
                });
            },
            like: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/like',
                    method: 'POST'
                });
            },
            unlike: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/unlike',
                    method: 'POST'
                });
            },
            rerawr: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/rerawr',
                    method: 'POST'
                });
            },
            unrerawr: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/unrerawr',
                    method: 'POST'
                });
            }
        };

    }]);

});

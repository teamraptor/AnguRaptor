'use strict';

define(['AnguRaptor', 'services/DateService', 'services/MediaService'], function(AnguRaptor) {

    //  var root = 'http://10.0.1.6:10101';
    var root = 'http://localhost:8080';
    // var root = 'http://api-raptor:8080';

    AnguRaptor.service('api', ['$http', '$q', '$cookies', '$window', '$rootScope', 'DateService', 'MediaService', function($http, $q, $cookies, $window, $rootScope, DateService, MediaService) {

        var sessionValid = undefined;

        function endpoint(options) {
            options.url = root + options.url;
            options.after = options.after || function(data) {
                return data;
            };
            options.afterError = options.afterError || function(data) {
                return data;
            };
            options.headers = options.headers  ||  {};
            options.auth = options.auth || false;
            options.method = options.method || 'GET';

            var headers = {
                'Content-Type': 'application/json'
            };

            headers = Object.assign(headers, options.headers);

            if (options.method === 'POST') {
                headers['X-CSRF-TOKEN'] = $cookies.get('X-CSRF-TOKEN');
            }

            var httpConfig = {
                url: options.url,
                method: options.method,
                params: options.params,
                data: options.body,
                withCredentials: true,
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

        function buildSession(response, headers) {
            var now = new $window.Date();
            var exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
            $cookies.put('X-CSRF-TOKEN', headers('X-CSRF-TOKEN'), {
                expires: exp
            });
            sessionValid = true;
            $rootScope.$broadcast('session.change');
            return response;
        }

        function destroySession(response) {
            console.log(response);
            $cookies.remove('X-CSRF-TOKEN');
            sessionValid = false;
            $rootScope.$broadcast('session.change');
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

        function testSession(response) {
            if (sessionValid == null) {
                if (response.error) {
                    sessionValid = false;
                } else {
                    sessionValid = true;
                }
            }
            return sessionValid;
        }

        this.user = {
            get: function() {
                return endpoint({
                    url: '/user',
                    auth: true
                });
            },
            login: function(username, password) {
                return endpoint({
                    url: '/auth/login',
                    method: 'POST',
                    body: {
                        'j_username': username,
                        'j_password': password
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }
                        return str.join('&');
                    },
                    after: buildSession
                });
            },
            logout: function() {
                return endpoint({
                    url: '/auth/logout',
                    method: 'POST',
                    after: destroySession,
                    afterError: destroySession
                });
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
                if (sessionValid == null) {
                    return endpoint({
                        url: '/user',
                        method: 'HEAD',
                        after: testSession,
                        afterError: testSession
                    });
                } else {
                  return $q(function(resolve) {
                    resolve(sessionValid);
                  });
                }
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
                    auth: true,
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
                    auth: true,
                    after: buildNotifications
                });
            },
            unreadCount: function() {
                return endpoint({
                    url: '/user/notifications/count',
                    auth: true
                });
            },
            markRead: function(notificationIds) {
                return endpoint({
                    url: '/user/notifications/read',
                    method: 'POST',
                    body: notificationIds,
                    auth: true
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
                    method: 'POST',
                    auth: true
                });
            },
            unfollow: function(useranme) {
                return endpoint({
                    url: '/users/' + useranme + '/unfollow',
                    method: 'POST',
                    auth: true
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
                    },
                    auth: true
                });
            },
            like: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/like',
                    method: 'POST',
                    auth: true
                });
            },
            unlike: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/unlike',
                    method: 'POST',
                    auth: true
                });
            },
            rerawr: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/rerawr',
                    method: 'POST',
                    auth: true
                });
            },
            unrerawr: function(rawrId) {
                return endpoint({
                    url: '/rawrs/' + rawrId + '/unrerawr',
                    method: 'POST',
                    auth: true
                });
            }
        };

    }]);

});

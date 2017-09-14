// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', [
        'ionic',
        'ngCordova',
        'ngResource',
        'ngMaterial',
    ])

    .run(function($ionicPlatform, AdMob) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            AdMob.init();

        });
    })

    //constants
    .constant("PARAMS", {
        "APP_NAME": "LOVERSIFY",
        "SERVER_URL": "http://app.loversify.com",
        //"SERVER_URL": "http://127.0.0.1/loversify-server"//"http://192.168.43.146/loversify-server"

    })

    //destory the touch for angular material.
    .config(function($mdGestureProvider) {
        $mdGestureProvider.skipClickHijack();
    })

    //http headers
    .config(function($httpProvider) {
       // $httpProvider.defaults.headers.common.Authorization = 'Bearer YWRtaW46MTIzNDU2Nzg5';

    })

    //app rates
    .config(function ($cordovaAppRateProvider) {

        document.addEventListener("deviceready", function () {

            var prefs = {
                language: 'en',
                appName: 'Loversify',
                iosURL: '<my_app_id>',
                androidURL: 'market://details?id=com.loversify.loversify',
                windowsURL: 'ms-windows-store:Review?name=<...>',
                customLocale: {
                    title: "Rate %@",
                    message: "If you enjoy using %@, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!",
                    cancelButtonLabel: "No, Thanks",
                    laterButtonLabel: "Remind Me Later",
                    rateButtonLabel: "Rate It Now"
                }
            };

            $cordovaAppRateProvider.setPreferences(prefs)

         }, false);
    })

    //states
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('welcome', {
                url: '/welcome',
                controller: 'WelcomeCtrl',
                cache: false,
                templateUrl: 'templates/welcome.html',
                onEnter: function($state, AppUser) {

                    if (!AppUser.loggedin)
                        $state.go('auth.login');

                }
            })

            //auth
            .state('auth', {
                url: '/auth',
                abstract: true,
                controller: 'AuthCtrl',
                templateUrl: 'templates/auth.html',
                onEnter: function($state, AppUser) {

                    if (AppUser.loggedin)
                        $state.go('welcome');

                }
            })

            .state('auth.login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'templates/auth/login.html'
            })

            .state('auth.signup', {
                url: '/signup',
                controller: 'SignupCtrl',
                templateUrl: 'templates/auth/signup.html',
                resolve: {
                    countries: ['$q', '$http', function($q, $http) {

                        var deferred = $q.defer();

                        $http.get('static/countries.json').success(function(res) {
                            deferred.resolve(res);
                        });

                        return deferred.promise;
                    }]
                }
            })

            .state('auth.help', {
                url: '/auth-help',
                controller: 'AuthHelpCtrl',
                templateUrl: 'templates/auth/help.html',
            })

            .state('auth.forgot-pass', {
                url: '/forgot-pass',
                templateUrl: 'templates/auth/forgot-pass.html',
                controller: 'ForgotPasswordCtrl',
            })

            //app
            .state('app', {
                url: '/app',
                abstract: true,
                controller: 'MainCtrl',
                templateUrl: 'templates/app.html',   
            })

            .state('app.categories', {
                url: '/categories',
                controller: 'CategoriesCtrl',
                cache: false,
                templateUrl: 'templates/app/categories.html',
                resolve: {
                    category : [function() {
                        return 0;
                    }],
                }
            })

            .state('app.category', {
                url: '/categories/:parentId',
                controller: 'CategoriesCtrl',
                cache: false,
                templateUrl: 'templates/app/categories.html',
                resolve: {
                    category : ['$q', '$stateParams', 'AppCategories', function($q, $stateParams, AppCategories) {

                        parentId = $stateParams.parentId;

                        var deferred = $q.defer();

                        AppCategories.view({id : parentId}).then(function(res) {

                            deferred.resolve(res.data);
                        });

                        return deferred.promise;
                    }],
                }
            })

            .state('app.posts', {
                url: '/posts/:catId',
                controller: 'PostsCtrl',
                cache: false,
                templateUrl: 'templates/app/posts.html',
                resolve: {
                    category : ['$q', '$stateParams', 'AppCategories', function($q, $stateParams, AppCategories) {

                        parentId = $stateParams.catId;

                        var deferred = $q.defer();

                        AppCategories.view({id : parentId}).then(function(res) {

                            deferred.resolve(res.data);
                        });

                        return deferred.promise;
                    }]
                }
            })

            .state('app.posts_content', {
                url: '/posts-content/:postId/:userId',
                controller: 'PostsContentCtrl',
                cache: false,
                templateUrl: 'templates/app/posts_content.html',
                resolve: {
                    post : ['$q', '$stateParams', 'AppPosts', function($q, $stateParams, AppPosts) {

                        postId = $stateParams.postId;
                        userId = $stateParams.userId;

                        var deferred = $q.defer();

                        AppPosts.view({'id': postId, 'user': userId}).then(function(res) {
                            deferred.resolve(res.data);
                        });

                        return deferred.promise;
                    }]
                    // post : ['$q', '$stateParams', 'AppPostsContent', function($q, $stateParams, AppPostsContent) {
                    //     var deferred = $q.defer();

                    //      deferred.resolve(AppPostsContent.post);

                    //     return deferred.promise;
                    // }]
                }
            })

            .state('app.blocks', {
                url: '/blocks',
                cache: false,
                controller: 'BlocksPageCtrl',
                templateUrl: 'templates/app/blocks.html',
                resolve: {
                    block : [function() {
                        return 0;
                    }],
                }
            })

            .state('app.block', {
                url: '/blocks/:blockId',
                cache: false,
                controller: 'BlocksPageCtrl',
                templateUrl: 'templates/app/blocks.html',
                resolve: {
                    block : ['$q', '$stateParams', 'AppBlocks', function($q, $stateParams, AppBlocks) {

                        blockId = $stateParams.blockId;

                        var deferred = $q.defer();

                        AppBlocks.view({'id': blockId}).then(function(res) {

                            deferred.resolve(res.data);
                        });

                        return deferred.promise;
                    }],
                }
            })

            .state('app.favorites', {
                url: '/favorites',
                cache: false,
                controller: 'FavoritesCtrl',
                templateUrl: 'templates/app/favorites.html',
            })

            .state('app.resources', {
                url: '/resources',
                controller: 'ResourcesCtrl',
                cache: false,
                templateUrl: 'templates/app/resources.html',
                resolve: {
                    resource : [function() {
                        return 0;
                    }],
                }
            })

            .state('app.resource', {
                url: '/resources/:resourceId',
                controller: 'ResourcesCtrl',
                cache: false,
                templateUrl: 'templates/app/resources.html',
                resolve: {
                    resource : ['$q', '$stateParams', 'AppPages', function($q, $stateParams, AppPages) {

                        resourceId = $stateParams.resourceId;

                        var deferred = $q.defer();

                        AppPages.view(resourceId).then(function(res) {

                            deferred.resolve(res.data);
                        });

                        return deferred.promise;
                    }],
                }
            })

            .state('app.help', {
                url: '/help',
                controller: 'HelpCtrl',
                cache: false,
                templateUrl: 'templates/app/help.html',
            })

            .state('app.notifications', {
                url: '/notifications',
                controller: 'NotificationsCtrl',
                cache: false,
                templateUrl: 'templates/app/notifications.html',
            })


            //user
            .state('user', {
                url: '/me',
                abstract: true,
                controller: 'UserCtrl',
                templateUrl: 'templates/user.html',
            })

            .state('user.profile', {
                url: '/profile',
                cache: false,
                controller: 'ProfileCtrl',
                templateUrl: 'templates/user/profile.html',
            })

            .state('user.settings', {
                url: '/settings',
                cache: false,
                controller: 'ProfileCtrl',
                templateUrl: 'templates/user.html',
            })

            .state('user.contact', {
                url: '/contact-us',
                cache: false,
                controller: 'ContactCtrl',
                templateUrl: 'templates/app/contact.html',
            })



        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/auth/login');

    });
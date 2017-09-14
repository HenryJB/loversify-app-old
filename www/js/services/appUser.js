'use strict';

app
    .factory('AppUser', ['$rootScope', '$http', '$stateParams', '$q', '$timeout', 'PARAMS',
        function($rootScope, $http, $stateParams, $q, $timeout, PARAMS) {

            var self;

            function b64_to_utf8(str) {

                var str = str.replace('-', '+').replace('_', '/');
                return decodeURIComponent(window.atob(str));
            }

            function AppUserKlass() {

                this.aclDefer = $q.defer();
                this.user = {};
                this.acl = this.aclDefer.promise;
                this.loggedin = false;

                //errors
                this.loginError = 0;
                this.registerError = null;
                this.resetpassworderror = null;

                //self
                self = this;

                var response = {};
                response.token = localStorage.getItem('JWT');

                if (!response || !response.token || response.token == 'null') {
                    return;
                }

                self.onIdentity.bind(self)(response);

                this.acl.then(function(response) {

                    self.acl = response;
                    delete self.aclDefer;

                });

            }

            AppUserKlass.prototype.getImage = function() {
                var timestamp = Date.now();
                return (this.user.photo)?PARAMS.SERVER_URL+'/public/uploads/users/'+this.user.photo+'?'+timestamp : 'img/avatar.jpg'
            };

            AppUserKlass.prototype.onIdentity = function(response,isNew) {
                var self = this;

                if (!response || !response.token || response.token == 'null') {
                    console.log('no response')
                    return;
                }

                var encodedUser, user;

                if (angular.isDefined(response.token)) {
                    localStorage.setItem('JWT', response.token);
                    encodedUser = decodeURI(b64_to_utf8(response.token.split('.')[1]));
                    user = JSON.parse(encodedUser).uid;
                    localStorage.setItem('JWT', response.token);
                }

                this.user = user;
                this.user.imageurl = this.getImage();
                this.loggedin = true;
                this.loginError = 0;
                this.registerError = 0;

                console.log(this.user);

                if(isNew)
                    $rootScope.$emit('loggedin', this.user);
                else
                    $rootScope.$emit('updated', this.user);
            };

            AppUserKlass.prototype.onIdFail = function(response) {

                this.loginError = 'Authentication failed.';

                if (response && response.message) {
                    this.registerError = JSON.parse(response.message);
                    this.resetpassworderror = JSON.parse(response.message);
                }

                $rootScope.$emit('loginfailed');
                $rootScope.$emit('registerfailed');
            };

            var AppUser = new AppUserKlass();

            AppUserKlass.prototype.update = function(user) {

                $http.post(PARAMS.SERVER_URL + '/api/users/update', {
                        id: self.user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        country: user.country,
                        username: user.username,
                        phone: user.phone,
                        birthday: user.birthday,
                        gender: user.gender,
                        relationship_status: user.relationship_status
                    })
                    .then(function(res) {

                        if (!res.data.success) {
                            self.onIdFail.bind(self)(res.data.data);
                            return;
                        }

                        self.onIdentity.bind(self)(res.data.data,false);

                    }, function(res) {

                        self.onIdFail.bind(self)(res)

                    });
            };

            AppUserKlass.prototype.contact = function(contact) {
                $http.post(PARAMS.SERVER_URL + '/api/default/contact', {
                        name: self.user.first_name+' '+self.user.last_name,
                        email: self.user.email,
                        subject: contact.subject,
                        body: contact.body
                    })
                    .success(function(response) {
                        
                        $rootScope.$emit('contactmailsent', response);
                    })
                    .error(function(err){

                         $rootScope.$emit('contactmailsent', false);

                    });
            };

            AppUserKlass.prototype.login = function(user) {

                $http.post(PARAMS.SERVER_URL + '/api/default/login', {
                        email: user.email,
                        password: user.password
                    })
                    .then(function(res) {

                        if (!res.data.success) {
                            self.onIdFail.bind(self)(res.data.data);
                            return;
                        }

                        self.onIdentity.bind(self)(res.data.data,true);

                    }, function(res) {

                        self.onIdFail.bind(self)(res)

                    })
            };

            AppUserKlass.prototype.register = function(user) {

                $http.post(PARAMS.SERVER_URL + '/api/default/sign-up', {
                        email: user.email,
                        password: user.password,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        country: user.country,
                    })
                    .then(function(res) {

                        console.log(res);

                        if (!res.data.success) {
                            self.onIdFail.bind(self)(res.data.data);
                            return;
                        }

                        self.onIdentity.bind(self)(res.data.data,true);

                    }, function(res) {

                        console.log(res);

                        self.onIdFail.bind(self)(res)

                    })
            };

            AppUserKlass.prototype.resetpassword = function(user) {
                $http.post('/api/defaultreset/' + $stateParams.tokenId, {
                        password: user.password,
                        confirmPassword: user.confirmPassword
                    })
                    .success(this.onIdentity.bind(this))
                    .error(this.onIdFail.bind(this));
            };

            AppUserKlass.prototype.forgotpassword = function(user) {
                $http.post(PARAMS.SERVER_URL + '/api/default/request-password-reset', {
                        email: user.email
                    })
                    .success(function(response) {
                        $rootScope.$emit('forgotmailsent', response);
                    })
                    .error(this.onIdFail.bind(this));
            };

            AppUserKlass.prototype.logout = function() {
                this.user = {};
                this.loggedin = false;
                this.isAdmin = false;

                localStorage.setItem('JWT', '');
                localStorage.removeItem('JWT');
                localStorage.clear();

                $rootScope.$broadcast('logout');
            };

            return AppUser;
        }
    ]);
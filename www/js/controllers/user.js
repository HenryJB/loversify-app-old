app
.controller('UserCtrl', ['$rootScope', '$scope', '$state', 'PARAMS', 'AppUser', 'Alert', 'AdMob',
    function($rootScope, $scope, $state, PARAMS, AppUser, Alert, AdMob) {
        $scope.params = PARAMS;

        $scope.user = AppUser.user;
        $scope.contact = {};

        $scope.page = {
            title: 'PROFILE',
            disable: false
        }

        $scope.user.imageurl = AppUser.getImage();

        $scope.save = function(isValid) {

            if (!isValid) {
                $scope.submitted = true;

                return;
            }

            $scope.page.disable = true;

            AppUser.update($scope.user);

        }

        $scope.send = function(isValid) {


            if (!isValid) {

                Alert.toast('all fields are required');
                return;
            }

            $scope.submitted = true;


            AppUser.contact($scope.contact);
        }

        $scope.logout = function() {

            AppUser.logout();
        }

        $scope.$on('logout', function(res) {

            Alert.cleanup();

            $state.go('auth.login');
        });

        $rootScope.$on('updated', function(e, user) {

            Alert.toast('profile updated');

            $scope.user = AppUser.user
            $scope.page.disable = false;
        });

        $rootScope.$on('loginfailed', function(e, user) {

            Alert.toast('profile update failed');
            $scope.page.disable = false;

        });

        $rootScope.$on('contactmailsent', function(e, response) {

            $scope.submitted = false;
            $scope.page.disable = false;

            if (!response || !response.success) {

                Alert.toast('Mail not sent');
                return;
            }

            $scope.contact.subject = "";
            $scope.contact.body = "";

            Alert.toast('Mail sent');

        });

        //Alert.popover($scope,'app-popover.html');

        //Alert.modal($scope,'app-search-modal.html');

        //AdMob.hideBanner();
    }
])
.controller('ProfileCtrl', ['$scope', '$http', 'Alert', 'Pictures',
    function($scope, $http, Alert, Pictures) {

        $http.get('static/countries.json').success(function(res) {
            $scope.countries = res;
        });

        $scope.selectDate = function() {

            Alert.datepicker({
                date: $scope.user.birthday
            }).then(function(date) {

                $scope.user.birthday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            });
        };

        $scope.takePic = function(options) {

            Pictures.getPictures().then(function(res) {

                var fileurl = res[0];

                $scope.is_uploading = true;

                if (typeof fileurl === "undefined") {
                    $scope.is_uploading = false;
                    return;
                }

                Pictures.upload(fileurl, {
                    imagename: 'user-image-',
                    id: $scope.user.id
                }).then(function(result) {

                    console.log(result);

                    if (!result.success) {
                        Alert.toast('operation failed')
                        return;
                    }

                    Alert.toast('profile image updated');

                    $scope.user.imageurl = fileurl;
                    document.getElementById('dp').src = fileurl;
                    document.getElementById('sidebar-dp').src = fileurl;
                    $scope.is_uploading = false;

                }, function() {
                    $scope.is_uploading = false;
                });
            }, function() {
                $scope.is_uploading = false;
            });
        }

    }
])
.controller('AdvanceProfileCtrl', ['$scope', 'AppUserFields', 'AppUserFieldsData', 'Alert',
    function($scope, AppUserFields, AppUserFieldsData) {

        $scope.page = {}


        function load() {
            AppUserFields.find().then(function(res) {

                if(res.success)
                    $scope.fields = res.data;
            });
        }

        $scope.saveUserData = function(data) {

            let params = {
                user: $scope.user.id,
                field : data.field,
                value : (data.value),
            }

            AppUserFieldsData.save(params).then(function(res) {
                
                console.log('dynamic profile saved');
            });

        }

        load();

    }
])
.controller('ContactCtrl', ['$scope', 'AppPages', 'Alert',
    function($scope, AppPages, Alert) {

        $scope.page = {
            id: 0,
            title: 'Contact Us'
        }

        function load(){
            AppPages.viewTitle('contact').then(function(res) {

                if(!res.success){
                  return;
                }

                console.log(res)

                $scope.pageContact = res.data;

            });
        }

        load();

    }
]);
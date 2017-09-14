app
.factory('Alert', ['$rootScope', '$q', '$ionicLoading', '$cordovaToast','$ionicPopover', '$ionicModal', '$ionicHistory', '$cordovaDatePicker', '$cordovaAppRate', '$mdDialog',
    function($rootScope, $q, $ionicLoading, $cordovaToast, $ionicPopover, $ionicModal, $ionicHistory, $cordovaDatePicker, $cordovaAppRate, $mdDialog) {


        return {
            loading: function(hide, opts) {

                var loadingOpts = {
                    template: '<ion-spinner></ion-spinner>',
                    duration: 50000,
                };

                opts = (opts) ? opts : loadingOpts;

                if (!hide)
                    $ionicLoading.show(opts);
                else
                    $ionicLoading.hide();
            },

            dialog: function(title, msg) {

                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('ion-nav-view')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .content(msg)
                    .ok('Got it!')
                );

            },

            confirm: function(title, msg, ok, cancel) {

                ok = (ok) ? ok : 'ok';
                cancel = (cancel) ? cancel : 'cancel';

                var confirm = $mdDialog.confirm()
                    .title(title)
                    .content(msg)
                    .ok(ok)
                    .cancel(cancel);

                $mdDialog.show(confirm).then(function() {
                    $rootScope.$broadcast('confirmOk');
                }, function() {
                    $rootScope.$broadcast('confirmCancel');
                });
            },

            toast: function(msg) {

                $cordovaToast
                .show(msg, 'short', 'center')
                .then(function(success) {
                  // success
                }, function (error) {
                  // error
                });

            },

            popover: function($scope, template) {
                $ionicPopover.fromTemplateUrl(template, {
                    scope: $scope
                }).then(function(popover) {
                    $scope.popover = popover;
                });

                $scope.openPopover = function($event) {
                    $scope.popover.show($event);
                };
                $scope.closePopover = function() {
                    $scope.popover.hide();
                };
                //Cleanup the popover when we're done with it!
                $scope.$on('$destroy', function() {
                    $scope.popover.remove();
                });
                // Execute action on hidden popover
                $scope.$on('popover.hidden', function() {
                    // Execute action
                });
                // Execute action on remove popover
                $scope.$on('popover.removed', function() {
                    // Execute action
                });

            },

            modal: function($scope, template) {
                $ionicModal.fromTemplateUrl(template, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                });

                $scope.openModal = function() {
                    $scope.modal.show();
                };
                $scope.closeModal = function() {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                });
                // Execute action on hide modal
                $scope.$on('modal.hidden', function() {
                    // Execute action
                });
                // Execute action on remove modal
                $scope.$on('modal.removed', function() {
                    // Execute action
                });
            },

            datepicker: function(opts) {

                var deferred = $q.defer();

                var options = {
                    date: new Date(),
                    mode: 'date'
                };

                if (opts.date)
                    options.date = new Date(opts.date);

                console.log(opts);

                $cordovaDatePicker.show(options).then(function(date) {

                    deferred.resolve(date);
                });

                return deferred.promise;
            },

            rate: function() {

                try {
                    $cordovaAppRate.promptForRating(false).then(function(result) { });
                }
                catch(err) {
                    console.log(err)
                }
            },

            cleanup: function() {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            }

        }
    }
])
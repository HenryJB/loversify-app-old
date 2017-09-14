'use strict';

app.directive('pageLoader', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'AE',
        template: '<div class="icon b-a"><ion-spinner></ion-spinner></div>',
        link: function (scope, element) {
          element.addClass('hide');

          scope.$on('$stateChangeStart', function() {

            if(element.hasClass('hide'))
            element.removeClass('hide');
          });
          scope.$on('$stateChangeSuccess', function (event) {

            event.targetScope.$watch('$viewContentLoaded', function () {
              $timeout(function () {

                if(!element.hasClass('hide'))
                  element.addClass('hide');
              }, 600);
            });
          });
        }
      };
    }
  ]);
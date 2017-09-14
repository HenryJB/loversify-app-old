'use strict';




app.directive('notFound', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'AE',
            scope: {},
            template: '<div class="hero mt-40">' +
                '<div class="hero-header"><img src="img/not-found.png"></div>' +
                '<div class="hero-title">{{title}}</div>' +
                '<div class="hero-subtitle">{{message}}</div>' +
                '</div>',
            link: function(scope, element, attrs) {
                
                scope.title = '';
                scope.message = '';

                if(attrs.title && typeof attrs.title != 'undefined' && attrs.title !== "")
                  scope.title = attrs.title;

                if(attrs.message && typeof attrs.message != 'undefined'  && attrs.message !== "")
                  scope.message = attrs.message;

            }
        };
    }
]);
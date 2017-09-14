'use strict';

app.directive('accordionItem', [
    function($timeout) {
        return {
            restrict: 'AE',
            scope: {
                item: '=item',
            },
            template:   '<div class="item item-icon-left">' +
                            '<i class="text-muted small icon" ng-class="(active)? \'ion-minus\' :  \'ion-plus\'"></i>'+
                            '{{item.title}}' +
                        '</div>'+
                        '<div class="item-accordion hide">' +
                            '<div class="">{{item.content}}</div>' +
                        '</div>',
            link: function(scope, element, attr) {

                scope.active = false;
                
                element.on('click', function(){

                    scope.active = (!scope.active);

                    var target = angular.element(attr.target);
                    var item = angular.element(element[0].querySelector('.item') );
                    var item_accordion = angular.element(element[0].querySelector('.item-accordion') );
                    var icon = angular.element(element[0].querySelector('.item i') );

                    if (element.hasClass('active')) {
                        element.removeClass('active');
                        item_accordion.removeClass('show');
                        icon.removeClass('ion-minus').addClass('ion-plus');
                        
                    } else {
                        element.addClass('active');
                        item_accordion.addClass('show');
                        icon.removeClass('ion-plus').addClass('ion-minus');
                    }

                });


            }
        };
    }
]);
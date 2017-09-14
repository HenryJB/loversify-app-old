'use strict';




app.directive('postItem', [
    function() {
        return {
            restrict: 'AE',
            scope: {
                item: '=item',
            },
            template: '<div class="pt-5 pb-20">' +
                '<i class="icon ion-ios-arrow-right pull-right"></i>'+
                '<h3>{{item.title}}</h3>' +
                
                //'<div class="row post-stats-row">' +
                //'<div class="col"><i class="icon ion-ios-paper"></i> {{item.post_count}}</div>' +
                //'<div class="col"><i class="icon ion-eye"></i> {{item.view_count}}</div>' +
                //'<div class="col"><i class="icon ion-android-favorite"></i> {{item.like_count}}</div>' +
                //'</div>' +
                '</div>',
            link: function(scope, element, attrs) {
        
            }
        };
    }
]);
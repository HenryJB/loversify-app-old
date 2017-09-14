app.directive('inAppLink', ['$parse', '$rootScope',
    function($parse, $rootScope) {
        return {
            priority: 100,
            restrict: 'A',
            compile: function($element, attr) {
                
                console.log(attr.type);

                return {
                    pre: function link(scope, element) {

                        let url = '';

                        switch(attr.type){

                            case 'categories':

                                if(attr.id){
                                    url= '#/app/posts/'+attr.id;
                                }else{
                                    url = '#/app/categories';
                                }
                                break;

                            case 'post':

                                if(attr.id)
                                    url = '#/app/posts-content/'+attr.id+'/'+scope.user.id;
                                break;

                            case 'favorites':

                                if(attr.id){
                                    url = '#/app/posts-content/'+attr.id+'/'+scope.user.id;
                                }else{
                                    url= '#/app/favorites';
                                }
                                break;
                            case 'resources':
                                    if(attr.id){
                                        url = '#/app/resources/'+attr.id;
                                    }else{
                                        url = '#/app/resources';
                                    }
                                break;

                            case 'profile':
                                    url = '#/me/profile';
                                break;

                            case 'help':
                                    url = '#/app/help';
                                break;

                            case 'contact':
                                    url = '#/me/contact-us';
                                break;

                            case 'blocks':

                                if(attr.id){
                                    url= '#/app/blocks/'+attr.id;
                                }else{
                                    url = '#/app/blocks';
                                }
                                break;

                            default: break;
                        }

                        element.on('click', function(event) {

                            element.attr('href',url);

                            if(url == ''){
                                event.stopImmediatePropagation();
                                event.preventDefault();
                            }
                        });
                    },
                    post: function() {}
                }
            }
        }
    }
]);
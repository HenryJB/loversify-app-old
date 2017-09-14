app.factory('AppPostsContent', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/posts-content';
    var post;
    var self;

    function PostsContentKlass() {
        self = this;
        post = self.post;
    }


    var PostsContent = new PostsContentKlass();

    PostsContentKlass.prototype.post = function(post){

        self.post = post;
    }

    PostsContentKlass.prototype.find = function(params){

        return $http.get(url+ '/find/?'+ $httpParamSerializer(params))
        .then(function(res) {

            res.data.currentpage = res.headers('X-Pagination-Current-Page');
            res.data.pagecount = res.headers('X-Pagination-Page-Count');
            res.data.totalcount = res.headers('X-Pagination-Total-Count');

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }


    return PostsContent;

});
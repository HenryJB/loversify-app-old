app.factory('AppPosts', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/posts';

    var self;

    function PostsKlass() {

        this.aclDefer = $q.defer();
        this.acl = this.aclDefer.promise;

        self = this;

        this.acl.then(function(response) {

            console.log(response);

            self.acl = response;
            delete self.aclDefer;
        });

    }


    var Posts = new PostsKlass();


    PostsKlass.prototype.all = function(params){

        return $http.get(url)
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.view = function(params){

        return $http.get(url +  '/view/?' + $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.find = function(params){

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

    PostsKlass.prototype.favorites = function(params){

        return $http.get(url+ '/favorites/?'+ $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.userMeta = function(params){

        return $http.get(url+ '/meta/?'+ $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.like = function(params){

        return $http.get(url+ '/like/?'+ $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.share = function(params){

        return $http.get(url+ '/share/?'+ $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    PostsKlass.prototype.search = function(params){

        return $http.get(url+ '/search/?'+ $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }


    return Posts;

});
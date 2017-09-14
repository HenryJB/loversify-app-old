app.factory('AppCategories', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/categories';

    var self;

    function CategoriesKlass() {

        this.aclDefer = $q.defer();
        this.acl = this.aclDefer.promise;

        self = this;

        this.acl.then(function(response) {

            console.log(response);

            self.acl = response;
            delete self.aclDefer;
        });

    }


    var Categories = new CategoriesKlass();

    CategoriesKlass.prototype.all = function(){

        return $http.get(url)
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    CategoriesKlass.prototype.view = function(params){

        return $http.get(url +  '/view/?' + $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }


    CategoriesKlass.prototype.find = function(params){

        return $http.get(url + '/find/?'+$httpParamSerializer(params))
        .then(function(res) {

            res.data.currentpage = res.headers('X-Pagination-Current-Page');
            res.data.pagecount = res.headers('X-Pagination-Page-Count');
            res.data.totalcount = res.headers('X-Pagination-Total-Count');

            return res.data;

        })
    }

    CategoriesKlass.prototype.posts = function(){

        return $http.get(url + '/posts/?'+$httpParamSerializer({id : self.id}))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    return Categories;

});
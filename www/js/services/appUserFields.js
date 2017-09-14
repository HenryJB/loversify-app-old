app.factory('AppUserFields', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/users-fields';
    var post;
    var self;

    function UserFieldsKlass() {
        self = this;
        post = self.post;
    }


    var UserFields = new UserFieldsKlass();

    UserFieldsKlass.prototype.all = function(params){

        return $http.get(url)
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    UserFieldsKlass.prototype.find = function(params){

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


    return UserFields;

});
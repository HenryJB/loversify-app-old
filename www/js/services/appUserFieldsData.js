app.factory('AppUserFieldsData', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/users-fields-data';
    var post;
    var self;

    function UserFieldsDataKlass() {
        self = this;
        post = self.post;
    }


    var UserFieldsData = new UserFieldsDataKlass();

    UserFieldsDataKlass.prototype.all = function(params){

        return $http.get(url)
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    UserFieldsDataKlass.prototype.get = function(params){

        return $http.get(url+ '/get-user-data/?'+ $httpParamSerializer(params))
        .then(function(res) {
            
            return res.data;

        }, function(res) {

           console.log(res)

        })

    }

    UserFieldsDataKlass.prototype.save = function(params){

        return $http.post(url+ '/save',{
            user: params.user,
            field: params.field,
            value: params.value+""
        })
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    UserFieldsDataKlass.prototype.find = function(params){

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


    return UserFieldsData;

});
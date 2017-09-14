app.factory('AppBlocks', function($http, $httpParamSerializer, $resource, $q, PARAMS) {

    var url = PARAMS.SERVER_URL + '/api/blocks';

    var self;

    function ResourcesKlass() {

        this.aclDefer = $q.defer();
        this.acl = this.aclDefer.promise;

        self = this;

        this.acl.then(function(response) {

            console.log(response);

            self.acl = response;
            delete self.aclDefer;
        });

    }


    var Resources = new ResourcesKlass();

    ResourcesKlass.prototype.all = function(){

        return $http.get(url)
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }

    ResourcesKlass.prototype.view = function(params){

        return $http.get(url +  '/view/?' + $httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        }, function(res) {

           console.log(res)

        })
    }


    ResourcesKlass.prototype.find = function(params){

        return $http.get(url + '/find/?'+$httpParamSerializer(params))
        .then(function(res) {

            return res.data;

        })
    }

    return Resources;

});
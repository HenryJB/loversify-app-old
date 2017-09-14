app.factory('Pictures', ['$rootScope', '$q', '$http','$ionicPlatform', '$cordovaImagePicker', 'PARAMS',
    function($rootScope, $q, $http, $ionicPlatform, $cordovaImagePicker, PARAMS) {

    	var url = PARAMS.SERVER_URL;

    	var is_allowed = false;

        var options = {
			maximumImagesCount: 2,
        };


        function getPermission(){

        	var deferred = $q.defer();

        	cordova.plugins.diagnostic.requestRuntimePermission(function(status){
	        	if (cordova.plugins.diagnostic.permissionStatus.GRANTED === status) {
			        deferred.resolve( true );
			    } else {
			        alert('Allow the requested permission');
			    } 
	        }, function(error){
	        	deferred.reject(error);
	        }, cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE);

	        return deferred.promise;
        }

        function upload(fileurl,opts){

        	var deferred = $q.defer();
			
			window.resolveLocalFileSystemURI(fileurl, function(fileEntry) {

			    fileEntry.file(function(file) {

			        var reader = new FileReader();
			        reader.onloadend = function(e) {
			            var imgBlob = new Blob([this.result], {
			                type: "image/jpeg"
			            });

			            var fd = new FormData();
			
			            fd.append('photo', imgBlob);
			            fd.append('id', opts.id);
			            fd.append('photoname', opts.imagename + ".jpg");

			            console.log(fd);
			            //post form call here
			            $http({
			            	url: url+'/api/users/upload',
			            	method: 'POST',
			            	data : fd,
			            	headers: {
		                    	'Content-Type': undefined
		                	},
		                	transformRequest: angular.identity,
		                	withCredentials: false,
			            }).then(function(res){

			            	deferred.resolve( res.data);

			            },function(res){

			            	deferred.reject(res);
			            });
			        };
			        reader.readAsArrayBuffer(file);

			    });
			});

			return deferred.promise;
		}

        function getPictures() {

        	var deferred = $q.defer();

        	getPermission().then(function(res){

        		if(!res)
        			return;

        		$cordovaImagePicker.getPictures(options)
	                .then(function(results) {
	                     deferred.resolve( results);
	                }, function(error) {
	                    deferred.reject('Error: ' + JSON.stringify(err));
	                });

        	});

            

            return deferred.promise;
        }


        

        return {
        	getPictures : getPictures,
        	upload: upload
        }
    }
])
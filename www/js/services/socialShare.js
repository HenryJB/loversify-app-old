app.factory('SocialShare', ['$q', '$cordovaSocialSharing', function($q, $cordovaSocialSharing) {

    return {
        all: function(message, subject, file, link) {
            var deferred = $q.defer();


            $cordovaSocialSharing
                .share(message, subject, file, link) // Share via native share sheet
                .then(function(result) {
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    }
}])
/**
 * Created by Gbenga on 6/2/2015.
 */
angular.module('LocalStorage',[])
.constant("ERR0R_CODES", {"STORAGE": "0001","REQIREMENT": "0002"})
    .factory('$localstorage',['$window','$q','$rootScope',function($window,$q,$rootScope,ERR0R_CODES){

        var encodedkey = function randomstring(L,prefix){
            var s= '';
            var randomchar=function(){
              var n= Math.floor(Math.random()*62);
              if(n<10) return n; //1-10
                if(n<36) return String.fromCharCode(n+55); //A-Z
              return String.fromCharCode(n+61); //a-z
            }
            while(s.length< L) s+= randomchar();

            if(prefix !== false)
              s= prefix+"-"+s;

            return s;
        };

         var set =  function(key, value) {
            $window.localStorage[key] = value;
        };

        var get = function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };

        

        $set= function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };
        $get = function(key,array) {

            if(array)
              return JSON.parse($window.localStorage[key] || '[]');

            return JSON.parse($window.localStorage[key] || '{}');
        };

        var find = function(table,search,key,index){

            var rows = $get(table);

            for (var i = 0; i < rows.length; i++) {

              if (rows[i][search] === key) {

                return {
                  data : rows[i],
                  index : i,
                }


              }
            }
            return null;

        }


        $getP = function(key,array) {

           var deferred = $q.defer();

           try{
            if(array)
              deferred.resolve(JSON.parse($window.localStorage[key] || '[]'));
            else
              deferred.resolve( JSON.parse($window.localStorage[key] || '{}') );

          }catch(e){

            deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });
          }

          return deferred.promise;
        };

        var $endpoint = function(key,end,value){

                var deferred = $q.defer();

               var data = $get(key);

               try{
                  if(!end || end ==''){
                   // end = encodedkey(8,Object.keys(data).length);
                    //value['uid'] = end;

                    end  = data.length;

                  }

                   data[end] = value;
                    $set(key,data);

                   deferred.resolve({
                       key:    key,
                       uid:    end,
                       value:  data
                   });

               } catch(e){

                 deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });

               }
              
              return deferred.promise;
        };


        return {
            set: set,
            get: get,
            find : find,
            $set: $set,
            $get: $get,
            $getPromise:$getP,
            $endpoint: $endpoint,
            /**
            @function $create create new key value pair
            @param {string} key - key of the storage
            @param {object} value - value of the storage
            @param {optional Boolean} unique - whether the storage should have a unique key.
            */
            $create : function(key, value,unique){

               var deferred = $q.defer();

               //return array
               var data = $get(key,true);
               if(unique){
                  keyx = key+"-"+encodedkey(8);

                  $set(keyx,value);

                  data.push(keyx);
               }
               else
                data.push(value);
                  
              $set(key,data);
                
              deferred.resolve({
                        key:    key,
                        value:  JSON.parse($window.localStorage[key] || '{}')
              });

              return deferred.promise;
            },
            $saveArray : function(key, value){

              try{

               var deferred = $q.defer();

               var data = $get(key,true);

               
               //console.log(data);
               var uid =encodedkey(8);

               value['uid'] = (data.length)+"-"+uid;
               
               data.push(value);

               $set(key,data);

               deferred.resolve({
                        key:    key,
                        uid :   value['uid'],
                        value:  JSON.parse($window.localStorage[key] || '{}')
                    });

             }
             catch(e){
                 deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });

             }
                return deferred.promise;
            },
            $save : function(key, value) {
                var deferred = $q.defer();
              try{

                $set(key,value);

                deferred.resolve({
                        key:    key,
                        value:  value
                    });
              }
              catch(e){
                 deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });

             }

             return deferred.promise;
            },
            $rename : function(okey, key) {
                var deferred = $q.defer();
              try{

                if(okey == key)
                  throw {message :  " same name"};                

                data = $get(okey);

                $set(key,data);
                set(okey,'');

                deferred.resolve({
                        key:    key,
                        value:  data
                    });
              }
              catch(e){
                 deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });

             }

             return deferred.promise;
            },
            $clear : function(key,endpoint) {

              var deferred = $q.defer();
              try{

                if(endpoint){

                  $endpoint(key,endpoint,'');

                }
                else{
                  if(key)
                      $window.localStorage[key] = '';
                  else{

                  }
                }


                deferred.resolve({status:1});
              }
              catch(e){
                 
                 deferred.reject({
                        key:    key,
                        status:ERR0R_CODES.STORAGE,
                        message:  e.message
                    });

              }
                return deferred.promise;
            }
        }
    }])
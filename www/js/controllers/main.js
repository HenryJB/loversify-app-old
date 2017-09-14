app
.controller('WelcomeCtrl',['$scope', 'AppUser', 'AppBlocks', 'Alert',
    function($scope, AppUser,  AppBlocks, Alert){

      $scope.user = AppUser.user;

      function load(){
        
        AppBlocks.find({
          'params[type]': 1,
          'params[countries]': $scope.user.country,
          'params[age]': $scope.user.birthday,
          'params[gender]': $scope.user.gender,
          'params[relationship_status]': $scope.user.relationship_status,
        }).then(function(res) {

            if(!res.success){
              return;
            }

            $scope.blocks = res.data;
        });
      }

      Alert.modal($scope,'app-help-item.html');

      load();
      
    }
])
.controller('MainCtrl',['$rootScope', '$scope', '$state', 'PARAMS', 'AppUser', 'Alert', 'AdMob',
    function($rootScope, $scope, $state, PARAMS, AppUser, Alert, AdMob){

      $scope.params = PARAMS;

      $scope.page = {
        title : $scope.params.APP_NAME
      }

      $scope.user = AppUser.user;


      $scope.logout = function(){

        console.log('xxxx');

      	AppUser.logout();
      }
      
      Alert.popover($scope,'app-popover.html');

      Alert.modal($scope,'app-search-modal.html');

      Alert.rate();

      AdMob.showBanner();

      $scope.$on('logout', function(res) {
        Alert.cleanup();

        $state.go('auth.login');
      });

    }
])
.controller('SearchCtrl',['$scope', 'AppPosts',
    function($scope, AppPosts){

      $scope.searchText = '';
      $scope.posts = [];
      $scope.searched = false;

      $scope.searchTextChanged = function(){

        if($scope.searchText.length < 3 )
          return;

          AppPosts.search({title: $scope.searchText}).then(function(res){

            $scope.searched = true;

              if(res.data && res.success)
            $scope.posts = res.data;
          })
      }
      
    }
])
.controller('NotificationsCtrl',['$scope', 'Alert',
    function($scope, Alert){

     //Alert.modal($scope,'app-notification-modal.html',$scope);
      
    }
])
.controller('CategoriesCtrl',['$scope', '$state', 'AppCategories','category',
    function($scope, $state, AppCategories, category ){

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        if(category === 0)
          viewData.enableBack = false;
      });

      $scope.page = {
        title : 'Categories',
        current : 1,
        count : 1,
        size: 0,
        loading : false
      }

      $scope.category = null;

      if(category){
        $scope.page.title = category.name;
        $scope.category = category;
      }

      function load(){

        $scope.page.loading = true;

        AppCategories.find({'params[parent]': ($scope.category)? $scope.category.id : 0}).then(function(res) {

          if(!res)
            return;

          $scope.categories = res.data;
          $scope.page.count = res.pagecount;
          $scope.page.size = res.totalcount;

          $scope.page.loading = false;

          $scope.$broadcast('scroll.refreshComplete');

        });
      }

      load();
      

      $scope.refresh = function() {

        load();
      };

      $scope.catItemClicked = function(cat){

      }

      $scope.loadMore = function(){

        $scope.page.current++;

        AppCategories.find({'params[parent]': ($scope.category)? $scope.category.id : 0,'page' : $scope.page.current}).then(function(res) {
          $scope.categories = $scope.categories.concat(res.data);
          $scope.page.count = res.pagecount;
          $scope.page.size = res.totalcount;

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
    }
])
.controller('PostsCtrl',['$scope', 'AppPosts', 'AppPostsContent', 'category',
    function($scope, AppPosts, AppPostsContent, category){

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      }); 

      $scope.page = {
        id: category.id,
        title : 'Posts',
        current : 1,
        count : 1,
        size: 0,
      }

      $scope.page.title = category.name;

      function load(){
        AppPosts.find({'params[category]': category.id}).then(function(res) {

          if(!res.data){
            return;
          }
          $scope.posts = res.data;
          $scope.page.count = res.pagecount;
          $scope.page.size = res.totalcount;

        });
      }

      $scope.postClicked = function(post){

        //AppPostsContent.post(post);
        return false;
      };

      $scope.refresh = function() {

        var last_viewed = 0;
        if($scope.posts !== null && (typeof $scope.posts != 'undefined') )
          last_viewed = $scope.posts[0].created_at;

        AppPosts.find({'params[category]': category.id,'params[last_viewed]' : last_viewed}).then(function(res) {

          $scope.posts = res.data.concat($scope.posts);

          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      $scope.loadMore = function(){

        $scope.page.current++;

        AppPosts.find({'params[category]': category.id,'page' : $scope.page.current}).then(function(res) {
          $scope.posts = $scope.posts.concat(res.data);
          $scope.page.count = res.pagecount;
          $scope.page.size = res.totalcount;

          console.log(res);

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      load();

    }
])
.controller('PostsContentCtrl',['$scope', '$ionicScrollDelegate','$cordovaClipboard','Alert', 'SocialShare', 'AppPosts', 'post',
    function($scope, $ionicScrollDelegate, $cordovaClipboard, Alert, SocialShare, AppPosts, post){

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      });

      $scope.page = {
        title : 'Posts',
        current : 0,
        size: post.post_count,
      }

      $scope.post = post;
      $scope.post.meta = {};

      function meta(){
        AppPosts.userMeta({user: $scope.user.id, post: $scope.post.id}).then(function(res){

          if(res)
          $scope.post.meta = res.data;
        })
      }

      function load(){
        
        if(typeof $scope.post.posts != 'undefined' && $scope.post.posts.length > $scope.page.current )
          $scope.post.content = $scope.post.posts[$scope.page.current];
      }

      function replaceText(str) {

        str = str.replace(/(<([^>]+)>)/ig, '');

        var txt = document.createElement("textarea");
        txt.innerHTML = str;

        res = txt.value;

        return res;
      }

      load();
      meta();

      $scope.prev = function(){

          $scope.page.current --;

          load();

          $ionicScrollDelegate.scrollTop();
      }

      $scope.next = function(){

          $scope.page.current ++;

          load();

          $ionicScrollDelegate.scrollTop();
      };

      $scope.like = function(){

        AppPosts.like({
            user: $scope.user.id,
            post: post.id
        }).then(function(res) {

            if (!res.success) {
                Alert.toast('operation failed');

                return;
            }

            if (res.data === 1) {
                $scope.post.meta.is_like = 0;
                Alert.toast('Post removed from Favorites');
            } else {
                $scope.post.meta.is_like = 1;
                Alert.toast('Post added to Favorites');
            }

        })
      };

      $scope.share = function(){

        var message = '';
        message += post.title+'\n \n';
        //message += post.description+'\n \n';
        message += $scope.post.posts[$scope.page.current] +'\n \n';
        
        SocialShare.all(replaceText(message),'share',null,'https://goo.gl/oH7UuA').then(function(result){
          console.log(result);

          AppPosts.share({
            user: $scope.user.id,
            post: post.id
          });
        });//end social share
      };

      $scope.copy = function(){

        var message = '';
        message += post.title+'\n \n';
        //message += post.description+'\n \n';
        message += $scope.post.posts[$scope.page.current] +'\n \n';

        $cordovaClipboard
        .copy(replaceText(message))
        .then(function () {
          Alert.toast('text copied to clipboard')
        }, function () {
          Alert.toast('failed to copy text')
        });
      };

      $scope.refresh = function() {
        AppPosts.view({'id': post.id, 'user' : $scope.user.id}).then(function(res) {

            $scope.post = res.data;
            load();
            meta();

            $scope.$broadcast('scroll.refreshComplete');
        });
      };
      
    }
])
.controller('FavoritesCtrl',['$scope', 'AppPosts', 'AppPostsContent',
    function($scope, AppPosts, AppPostsContent){

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = false;
      }); 

      $scope.page = {
        id: 0,
        title : 'Favorites',
        loading : false
      }


      function load(){

        $scope.page.loading = true;

        AppPosts.favorites({'params[user]': $scope.user.id}).then(function(res) {

          $scope.favorites = res.data;

          $scope.page.loading = false;

          $scope.$broadcast('scroll.refreshComplete');

        });
      }

      load();

      $scope.init = function(){

      }

      $scope.refresh = function(){
        load();
      }

      $scope.loadMore = function(){

      }
      
    }
])
.controller('ResourcesCtrl',['$scope', 'AppPages', 'Alert', 'resource',
    function($scope, AppPages, Alert, resource){

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = false;
      }); 

      $scope.page = {
        id: 0,
        title : 'Resources'
      }

      Alert.modal($scope,'app-help-item.html');

      function load(){
        AppPages.viewTitle('resources').then(function(res) {

            if(!res.success){
              return;
            }

            $scope.resource = res.data;
            loadPages($scope.resource.id);

        });
      }

      function loadPages(id){
        AppPages.find({'params[parent]': id}).then(function(res) {

            if(!res.success){
              return;
            }
            $scope.resources = res.data;

            if(resource)
              $scope.itemClicked(resource);

        });
      }

      $scope.itemClicked = function(item){

        $scope.modalItem = item;
        $scope.openModal();
      }

      
      load();
      
    }
])
.controller('HelpCtrl',['$scope',  'AppPages', 'Alert',
    function($scope,  AppPages, Alert){

      $scope.page = {
        id: 0,
        title : $scope.params.APP_NAME
      }

      function load(){
        AppPages.viewTitle('help').then(function(res) {

            if(!res.success){
              return;
            }

            $scope.help = res.data;
            loadPages($scope.help.id);
        });
      }

      function loadPages(id){
        AppPages.find({'params[parent]': id}).then(function(res) {

            if(!res.success){
              return;
            }
            $scope.pages = res.data;

        });
      }

      $scope.itemClicked = function(item){

        $scope.modalItem = item;
        $scope.openModal();
      }

      Alert.modal($scope,'app-help-item.html');

      
      load();
      
    }
])
.controller('BlocksCtrl',['$scope', 'AppBlocks', 'Alert',
    function($scope, AppBlocks, Alert){

        Alert.modal($scope,'app-help-item.html');

      function load(){
        AppBlocks.find({
          'params[type]': 2,
          'params[countries]': $scope.user.country,
          'params[age]': $scope.user.birthday,
          'params[gender]': $scope.user.gender,
          'params[relationship_status]': $scope.user.relationship_status,
        }).then(function(res) {

            if(!res.success){
              return;
            }

            $scope.blocks = res.data;
        });


      }

      $scope.blockClicked = function(block){

        $scope.modalItem = block;
        $scope.openModal();
      }

      load();

      $scope.init = function(){

      }

      $scope.refresh = function(){
        load();
      }

      $scope.loadMore = function(){

      }

      
    }
])
.controller('BlocksPageCtrl',['$scope', 'block', 'AppBlocks', 'Alert',
    function($scope, block, AppBlocks, Alert){

        Alert.modal($scope,'app-help-item.html');

      function load(){
        AppBlocks.find({
          'params[type]': 2,
          'params[countries]': $scope.user.country,
          'params[age]': $scope.user.birthday,
          'params[gender]': $scope.user.gender,
          'params[relationship_status]': $scope.user.relationship_status,
        }).then(function(res) {

            if(!res.success){
              return;
            }

            if(block)
              $scope.blockClicked(block)

            $scope.blocks = res.data;
        });


      }

      $scope.blockClicked = function(block){

        $scope.modalItem = block;
        $scope.openModal();
      }

      load();

      $scope.init = function(){

      }

      $scope.refresh = function(){
        load();
      }

      $scope.loadMore = function(){

      }

      
    }
]);
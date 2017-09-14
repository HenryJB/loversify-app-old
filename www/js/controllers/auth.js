app
.controller('AuthCtrl',['$rootScope', '$scope', 'PARAMS','AdMob',
	function($rootScope, $scope, PARAMS,AdMob){

		console.log('in auth');

		$scope.page = {
	    	title : PARAMS.APP_NAME
		}

		$rootScope.$on('NO_INTERNET',function(){

	        Alert.toast('no connection available');

	    });

	    AdMob.removeAds();


	}
])
.controller('AuthHelpCtrl',['$rootScope', '$scope', '$state', 'Alert', 'AppPages',
	function($rootScope, $scope, $state, Alert, AppPages,){

		console.log('in auth');

		$scope.page = {
	    	title : 'Why Sign Up?'
		}

		$scope.help = {

		};


		function load(){
	        AppPages.viewTitle('why-sign-up').then(function(res) {

	            if(!res.success){
	              return;
	            }


	            console.log(res)

	            $scope.help = res.data;
	        });
	    }


	    load();


	}
])
.controller('LoginCtrl',['$rootScope', '$scope', '$state', 'Alert', 'AppUser',
	function($rootScope, $scope, $state, Alert, AppUser){

		$scope.user = {};

		$scope.login = function(isValid){

			if(!isValid){
				$scope.submitted = true;
				return;
			}

			Alert.loading();

			AppUser.login($scope.user);
		}


		$rootScope.$on('loggedin',function(e,user){

			$state.go('welcome');

			Alert.loading(true);
		})

		$rootScope.$on('loginfailed',function(e){
			Alert.toast('Email or password not correct');
			$scope.submitted = true;

			Alert.loading(true);
		})


	}
]).controller('SignupCtrl',['$rootScope', '$scope', '$state', 'Alert', 'AppUser','countries',
	function($rootScope, $scope, $state, Alert, AppUser,countries){

		$scope.user = {};
		$scope.countries = countries;
		
		$scope.signup = function(isValid){

			if($scope.user.password.length < 6){
				Alert.toast('passwords should contain at least 6 characters');
				$scope.submitted = true;
				return;
			}

			//if($scope.user.password != $scope.user.cpassword){
			// 	Alert.toast('passwords does not match');
			// 	$scope.submitted = true;
			// 	return;
			// }

			if(!isValid){
				$scope.submitted = true;
				return;
			}

			$scope.user.cpassword = $scope.user.password;

			Alert.loading();

			AppUser.register($scope.user);
		}

		
		$scope.gotoTerms=function(){
			//$state.go(auth.terms);
		}
		

		$rootScope.$on('loggedin',function(e){

			$state.go('welcome');
			Alert.loading(true);
		})

		$rootScope.$on('registerfailed',function(e){

			$scope.submitted = true;
			Alert.toast('invalid details');

			$scope.registerError = AppUser.registerError;

			console.log($scope.registerError);


			Alert.loading(true);
			
		})


	}
]).controller('ForgotPasswordCtrl',['$rootScope', '$scope', '$state', 'Alert', 'AppUser',
	function($rootScope, $scope, $state, Alert, AppUser){

		$scope.user = {};
		
		
		$scope.reset = function(isValid){

			if(!isValid){
				$scope.submitted = true;
				return;
			}

			Alert.loading();

			
			AppUser.forgotpassword($scope.user);
		}

		$rootScope.$on('forgotmailsent', function(e,res){

			$scope.submitted = true;


			if(!res.success)
				Alert.toast('invalid email address');
			else
				Alert.toast('Check your email for further instructions.');

			$scope.user.email = "";

			Alert.loading(true);
		});


	}
]);
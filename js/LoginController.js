var app = angular.module('app.controllers', ['ui.router']);

app.controller('LoginController', function($scope, $state) {
	$scope.user = {};

	$scope.login = function(user) {
		/**
		 * Anti NSA Login security 
		 * Edward Snowden would be proud 
		 */
		if( (user.username == "john" ) && (user.password == "password") ) {
			/**
			 * User passed our super secure login system (NSA still trying)
			 * then save the token in localStorage. In real live you would send this token
			 * in every request and if someone changes or deletes it the user is redirected to login page
			 */
			localStorage.setItem('auth-token', 'some.random.token');

			/**
			 * For the sake of the example lets save the user in localStorage too
			 * so later we can access the roles property.
			 */
			localStorage.setItem('currentUser', JSON.stringify( {username: 'john', roles: ['admin']} ));
			$state.go('admin');
		}else {
			$state.go('login');
		}

	}
});
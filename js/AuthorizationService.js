var app = angular.module('app.services', ['ui.router']);

app.factory('AuthorizationService', function() {
	return {
		/**
		 * These parameters are basically the access object from the next state
		 * @param boolean requiresLogin 
		 * @param array requiredPermissions (eg: Admin, Manager, whatever you want)
		 * @param array permissionType (eg: atLeastOne or All)
		 */
		authorize: function(requiresLogin, requiredPermissions, permissionType) {
			var result = 'authorized',
				token = localStorage.getItem('auth-token'),
				user = localStorage.getItem('currentUser'), // lets fake this for the sake of the example
				hasPermission = true,
				loweredPermissions = [],
				permission, i;


			if (requiresLogin === true && user === null) {
				result = 'loginIsRequired';
			/**
			 * if the state requires login and we have a user
			 * and the state doesn't requires any particular permission 
			 * the user is authorized to enter.
			 */
			} else if ( (requiresLogin === true && user !== null) && (requiredPermissions === undefined || requiredPermissions.length === 0) ) {
				result = 'authorized';

			/**
			 * Now if there's some permissions required,
			 * lets get the user and iterate his roles and for safety lowercase them
			 * so later we can compare them.
			 */
			} else if ( requiredPermissions ) {
				loweredPermissions = [];
				angular.forEach(user.roles, function(permission) {
					loweredPermissions.push(permission.toLowerCase());
				});

				for(i = 0; i < requiredPermissions.length; i++) {
					permission = requiredPermissions[i].toLowerCase();

					if(permissionType === 'all') {
						hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
						if(hasPermission === false) break;
					} else if (permissionType === 'atleastone') {
						hasPermission = loweredPermissions.indexOf(permission) > -1;
						if(hasPermission) break;
					}
				}
				result = hasPermission ? 'authorized' : 'notAuthorized';
			}
			return result;
		}
	};
});
(function() { 
var app = angular.module('app', ['ui.router', 'app.controllers', 'app.services']);
// Le Routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'home.html',
    })
    .state('about', {
        url: '/about',
        templateUrl: 'about.html',
    })
    .state('contact', {
    	url: '/contact',
    	templateUrl: 'contact.html',
    })
    .state('login', {
    	url: '/login',
        templateUrl: 'login.html'
    })
    .state('admin', {
    	url: '/admin',
    	templateUrl: 'admin.html',
        access: {                               // This object is going to be crucial to check the user permissions (roles).
            requiresLogin: true,                // It is super intuitive because we are saying;
            requiredPermissions: ['Admin'],     // Hey to access this state you should be logged in 
            permissionType: 'AtLeastOne'        // and at least have the Admin role
        }
    })
    .state('reporting', {
    	url: '/reporting',
    	templateUrl: 'reporting.html',
        access: {
            requiresLogin: true,
            requiredPermissions: ['Admin'],
            permissionType: 'AtLeastOne'
        }
    });
    //$locationProvider.html5Mode(true);
});
    
    /**
     * UI Router have events that we can hook things and one of them is: $stateChangeStart
     * Like the name says it happens right when route starts to change to another.
     * So we are going to listen for it and in every 'stateChangeStart' we are inspect the 'access' object
     * if there's one and determine if the user can enter the route or not.
     */
    app.run(function($rootScope, $location, $state, AuthorizationService) {
        /**
         * routeChangeStart accepts various params. We are focusing on mostly in 'toState'.
         * This allow us to hook to the next state data before we even get there.
         */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var authorized,
                currentUser = localStorage.getItem('currentUser'),
                // gets the token from localStorage or null|false if it doesn't exists 
                token = localStorage.getItem('auth-token'); 
            
            /**
             * Lets imagine that when we login our API gives us a token and we store it on localStorage
             * So if we already have the token it means the user is logged in so we shouldn't allow him to
             * access the login or the register page again. In that have he is redirected to the admin page.
             */
            if( (currentUser || token ) && (toState.name == 'login' || toState.name == 'register') ) {
                event.preventDefault();
                $state.go('admin');
            }

            /**
             * Now we check if the next state have the access object we defined in the routes (just up there).
             * If it is true we send the values (requiresLogin, requiredPermissions, permissionType) to our
             * Authorization Service and save the result in that authorized variable
             */
            if(toState.access !== undefined) {
                authorized = AuthorizationService.authorize(
                    toState.access.requiresLogin,
                    toState.access.requiredPermissions,
                    toState.access.permissionType
                );

                /**
                 * Here we already should have the result of our Authorization Service
                 * And if the result is 'loginIsRequired' or 'notAuthorized' (he might not have the right role)
                 * STOPS EVERYTHING and send him back to the login page otherwise let him through
                 */
                if(authorized === 'loginIsRequired' || authorized === 'notAuthorized') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });
    });
})();
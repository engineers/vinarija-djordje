var app = angular.module('App', [
  'angular-jwt',
  'ngMaterial',
  'ui.router',
  'md.data.table',
  'angularFileUpload',
  'LocalStorageModule',
  'textAngular',
  'slickCarousel',
  'ui.sortable'
])
.config(function ($urlRouterProvider, jwtInterceptorProvider, $httpProvider, $locationProvider, jwtOptionsProvider, localStorageServiceProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/blog');

    localStorageServiceProvider.setPrefix('vinarija_djordjevic');

    jwtInterceptorProvider.tokenGetter = function (localStorageService) {
        return localStorageService.get('token');
    };

    jwtOptionsProvider.config({
        tokenGetter: function (localStorageService) {
            return localStorageService.getItem('token');
        },
        whiteListedDomains: [
        	'localhost',
        ],
        unauthenticatedRedirectPath: '/login'
    });

    $httpProvider.interceptors.push('jwtInterceptor');
    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
})
.run(function ($rootScope, $state, jwtHelper, $mdToast, localStorageService) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!localStorageService.get('token') || jwtHelper.isTokenExpired(localStorageService.get('token'))) {
                e.preventDefault();
                $state.go('login');
            }
        } else if (localStorageService.get('token') && to.name == 'login') {
            e.preventDefault();
            $state.go('layout.blog')
        }

        $rootScope.session = localStorageService.get('token') ? jwtHelper.decodeToken(localStorageService.get('token')) : {};
    });

    $rootScope.$on('toast', function (e, data) {
        if (data && data.message) {
            $mdToast.show(
              $mdToast.simple()
                .content(data.message)
                .hideDelay(data.duration ? data.duration : 2000)
            );
        }
    });
});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/',
    postImagesPath: 'http://localhost:53491/Content/Posts/',
});

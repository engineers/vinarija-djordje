var app = angular.module('vinarija', ['ui.router', 'ngSanitize', 'uiGmapgoogle-maps']);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('layout.home');
    });

    $stateProvider
        .state('layout', {
            controller: 'LayoutController',
            templateUrl: '/views/layout.html',
            pageName: 'Layout'
        })
        .state('layout.home', {
            url: '/почетна',
            controller: 'HomeController',
            templateUrl: '/views/home.html',
            pageName: 'Почетна',
        })
       .state('layout.visit-winery', {
           url: '/посета-винарији',
           controller: 'VisitWineryController',
           templateUrl: '/views/visit-winery.html',
           pageName: 'Посета винарији',
       })
       .state('layout.winery', {
           url: '/винарија',
           controller: 'WineryController',
           templateUrl: '/views/winery.html',
           pageName: 'Винарија',
       })
       .state('layout.actualities', {
           url: '/актуелности',
           controller: 'ActualitiesController',
           templateUrl: '/views/actualities.html',
           pageName: 'Актуелности',
       })
       .state('layout.vineyards', {
           url: '/виногради',
           controller: 'VineyardsController',
           templateUrl: '/views/vineyards.html',
           pageName: 'Виногради',
       })
       .state('layout.wines', {
           url: '/вина',
           controller: 'WinesController',
           templateUrl: '/views/wines.html',
           pageName: 'Вина',
       })
       .state('layout.territory', {
           url: '/делиблатска-пешчара',
           controller: 'TerritoryController',
           templateUrl: '/views/territory.html',
           pageName: 'Делиблатска пешчара'
       });

    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $state) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        if (toState.pageName) {
            document.title = 'Винарија Ђорђе | ' + toState.pageName;
        }

    });

});

app.constant('config', {
    baseAddress: 'http://localhost:4857/api/'
});
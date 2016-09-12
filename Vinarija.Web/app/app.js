var app = angular.module('vinarija', ['ui.router', 'ngSanitize']); //'uiGmapgoogle-maps'

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
            url: '/pocetna',
            controller: 'HomeController',
            templateUrl: '/views/home.html',
            pageName: 'Почетна',
        })
       .state('layout.visit-winery', {
           url: '/poseta-vinariji',
           controller: 'VisitWineryController',
           templateUrl: '/views/visit-winery.html',
           pageName: 'Посета винарији',
       })
       .state('layout.winery', {
           url: '/vinarija',
           controller: 'WineryController',
           templateUrl: '/views/winery.html',
           pageName: 'Винарија',
       })
       .state('layout.actualities', {
           url: '/aktuelnosti',
           controller: 'ActualitiesController',
           templateUrl: '/views/actualities.html',
           pageName: 'Актуелности',
       })
       .state('layout.vineyards', {
           url: '/vinogradi',
           controller: 'VineyardsController',
           templateUrl: '/views/vineyards.html',
           pageName: 'Виногради',
       })
       .state('layout.wines', {
           url: '/vina',
           controller: 'WinesController',
           templateUrl: '/views/wines.html',
           pageName: 'Вина',
       })
       .state('layout.territory', {
           url: '/deliblatska-pescara',
           controller: 'TerritoryController',
           templateUrl: '/views/territory.html',
           pageName: 'Делиблатска пешчара'
       })
       .state('layout.red-wines', {
           url: '/crvena-vina',
           controller: 'RedWinesController',
           templateUrl: '/views/red-wines.html',
           pageName: 'Црвена вина',
       })
       .state('layout.white-wines', {
           url: '/bela-vina',
           controller: 'WhiteWinesController',
           templateUrl: '/views/white-wines.html',
           pageName: 'Бела вина',
       });

    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $state) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        $rootScope.$state = $state;

        if (toState.pageName) {
            document.title = 'Винарија Ђорђе | ' + toState.pageName;
        }

    });

});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/'
});
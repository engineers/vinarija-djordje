﻿var app = angular.module('vinarija', ['ui.router', 'ngSanitize', 'angularUtils.directives.dirPagination', 'pascalprecht.translate', 'app.translations']);
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, paginationTemplateProvider, $translateProvider, translations, config) {
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('layout.home');
    });
    paginationTemplateProvider.setPath('../views/dirPagination.tpl.html');

    $stateProvider
        .state('layout', {
            controller: 'LayoutController',
            templateUrl: '/views/layout.html?v=' + config.version,
            pageName: 'Layout'
        })
        .state('layout.home', {
            url: '/pocetna',
            controller: 'HomeController',
            templateUrl: '/views/home.html?v=' + config.version,
            pageName: 'Почетна',
            resolve: {
                postsData: function (blogService) {
                    var params = {
                        pageNumber: 1,
                        pageSize: 6,
                        orderBy: '-date'
                    };
                    return blogService.getPosts(params);
                },
                gallery: function (galleryService) {
                    return galleryService.getImages();
                }
            },
        })
       .state('layout.visit-winery', {
           url: '/poseta-vinariji',
           controller: 'VisitWineryController',
           templateUrl: '/views/visit-winery.html?v=' + config.version,
           pageName: 'Посета винарији',
       })
       .state('layout.winery', {
           url: '/vinarija',
           controller: 'WineryController',
           templateUrl: '/views/winery.html?v=' + config.version,
           pageName: 'Винарија',
       })
       .state('layout.actualities', {
           url: '/aktuelnosti',
           controller: 'ActualitiesController',
           templateUrl: '/views/actualities.html?v=' + config.version,
           resolve: {
               postsData: function (blogService) {
                   var params = {
                       pageNumber: 1,
                       pageSize: 6,
                       orderBy: '-date'
                   };
                   return blogService.getPosts(params);
               }
           },
           pageName: 'Актуелности',
       })
       .state('layout.vineyards', {
           url: '/vinogradi',
           controller: 'VineyardsController',
           templateUrl: '/views/vineyards.html?v=' + config.version,
           pageName: 'Виногради',
       })
       .state('layout.wines', {
           url: '/vina',
           controller: 'WinesController',
           templateUrl: '/views/wines.html?v=' + config.version,
           pageName: 'Вина',
       })
       .state('layout.territory', {
           url: '/deliblatska-pescara',
           controller: 'TerritoryController',
           templateUrl: '/views/territory.html?v=' + config.version,
           pageName: 'Делиблатска пешчара'
       })
       .state('layout.red-wines', {
           url: '/crvena-vina',
           controller: 'RedWinesController',
           templateUrl: '/views/red-wines.html?v=' + config.version,
           pageName: 'Црвена вина',
       })
       .state('layout.white-wines', {
           url: '/bela-vina',
           controller: 'WhiteWinesController',
           templateUrl: '/views/white-wines.html?v=' + config.version,
           pageName: 'Бела вина',
       })
       .state('layout.gallery', {
           url: '/galerija',
           controller: 'GalleryController',
           templateUrl: '/views/gallery.html?v=' + config.version,
           pageName: 'Галерија',
           resolve: {
               gallery: function (galleryService) {
                   return galleryService.getImages();
               }
           },
       });

    $locationProvider.html5Mode(true);

    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en', translations.en);
    $translateProvider.translations('srb', translations.srb)
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en')
});

app.run(function ($rootScope, $state, $anchorScroll) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        $anchorScroll(top);

        $rootScope.$state = $state;

        if ((!($state.current.name == 'layout.red-wines') || !($state.current.name == 'layout.white-wines')) && $('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        };

        if (toState.pageName) {
            document.title = 'Винарија Ђорђе | ' + toState.pageName;
        }

    });

});

//app.constant('config', {
//    baseAddress: 'http://enginee.rs:8122/api/',
//    contentAddress: 'http://enginee.rs:8122/Content/',
//    version: '1.3'
//});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/',
    contentAddress: 'http://localhost:53491/Content/'
});

//app.constant('config', {
//    baseAddress: 'http://192.168.0.121:9091/api/',
//    contentAddress: 'http://192.168.0.121:9091/Content/'
//});
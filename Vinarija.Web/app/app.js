var app = angular.module('vinarija', ['ui.router', 'ngSanitize', 'angularUtils.directives.dirPagination']);
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, paginationTemplateProvider) {
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('layout.home');
    });
    paginationTemplateProvider.setPath('../views/dirPagination.tpl.html');

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
            resolve: {
                postsData: function (blogService) {
                    var params = {
                        pageNumber: 1,
                        pageSize: 6
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
           resolve: {
               postsData: function (blogService) {
                   var params = {
                       pageNumber: 1,
                       pageSize: 6
                   };
                   return blogService.getPosts(params);
               }
           },
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
       })
       .state('layout.gallery', {
           url: '/galerija',
           controller: 'GalleryController',
           templateUrl: '/views/gallery.html',
           pageName: 'Галерија',
           resolve: {
               gallery: function (galleryService) {
                   return galleryService.getImages();
               }
           },
       });

    $locationProvider.html5Mode(true);
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
//    contentAddress: 'http://enginee.rs:8122/Content/'
//});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/',
    contentAddress: 'http://localhost:53491/Content/'
});
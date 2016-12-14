var app = angular.module('vinarija', ['ui.router', 'ngSanitize', 'angularUtils.directives.dirPagination', 'pascalprecht.translate', 'app.translations']);
app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', 'paginationTemplateProvider', '$translateProvider', 'translations', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, paginationTemplateProvider, $translateProvider, translations) {
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('layout.home');
    });
    paginationTemplateProvider.setPath('../views/dirPagination.tpl.html');

    $stateProvider
        .state('layout', {
            controller: 'LayoutController',
            templateUrl: '/views/layout.html?v=1.0',
            pageName: 'Layout'
        })
        .state('layout.home', {
            url: '/pocetna',
            controller: 'HomeController',
            templateUrl: '/views/home.html?v=1.0',
            pageName: 'Почетна',
            resolve: {
                postsData: ['blogService', function (blogService) {
                    var params = {
                        pageNumber: 1,
                        pageSize: 6,
                        orderBy: '-date'
                    };
                    return blogService.getPosts(params);
                }],
                gallery: ['galleryService', function (galleryService) {
                    return galleryService.getImages();
                }]
            },
        })
       .state('layout.visit-winery', {
           url: '/poseta-vinariji',
           controller: 'VisitWineryController',
           templateUrl: '/views/visit-winery.html?v=1.0',
           pageName: 'Посета винарији',
       })
       .state('layout.winery', {
           url: '/vinarija',
           controller: 'WineryController',
           templateUrl: '/views/winery.html?v=1.0',
           pageName: 'Винарија',
       })
       .state('layout.actualities', {
           url: '/aktuelnosti',
           controller: 'ActualitiesController',
           templateUrl: '/views/actualities.html?v=1.0',
           resolve: {
               postsData: ['blogService', function (blogService) {
                   var params = {
                       pageNumber: 1,
                       pageSize: 6,
                       orderBy: '-date'
                   };
                   return blogService.getPosts(params);
               }]
           },
           pageName: 'Актуелности',
       })
       .state('layout.vineyards', {
           url: '/vinogradi',
           controller: 'VineyardsController',
           templateUrl: '/views/vineyards.html?v=1.0',
           pageName: 'Виногради',
       })
       .state('layout.wines', {
           url: '/vina',
           controller: 'WinesController',
           templateUrl: '/views/wines.html?v=1.0',
           pageName: 'Вина',
       })
       .state('layout.territory', {
           url: '/deliblatska-pescara',
           controller: 'TerritoryController',
           templateUrl: '/views/territory.html?v=1.0',
           pageName: 'Делиблатска пешчара'
       })
       .state('layout.red-wines', {
           url: '/crvena-vina',
           controller: 'RedWinesController',
           templateUrl: '/views/red-wines.html?v=1.0',
           pageName: 'Црвена вина',
       })
       .state('layout.white-wines', {
           url: '/bela-vina',
           controller: 'WhiteWinesController',
           templateUrl: '/views/white-wines.html?v=1.0',
           pageName: 'Бела вина',
       })
       .state('layout.gallery', {
           url: '/galerija',
           controller: 'GalleryController',
           templateUrl: '/views/gallery.html?v=1.0',
           pageName: 'Галерија',
           resolve: {
               gallery: ['galleryService', function (galleryService) {
                   return galleryService.getImages();
               }]
           },
       });

    $locationProvider.html5Mode(true);

    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en', translations.en);
    $translateProvider.translations('srb', translations.srb)
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en')
}]);

app.run(['$rootScope', '$state', '$anchorScroll', function ($rootScope, $state, $anchorScroll) {

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

}]);

//app.constant('config', {
//    baseAddress: 'http://enginee.rs:8122/api/',
//    contentAddress: 'http://enginee.rs:8122/Content/'
//});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/',
    contentAddress: 'http://localhost:53491/Content/'
});

//app.constant('config', {
//    baseAddress: 'http://192.168.0.121:9091/api/',
//    contentAddress: 'http://192.168.0.121:9091/Content/'
//});
app.controller('ActualitiesController', ['$scope', 'blogService', 'postsData', 'config', function ($scope, blogService, postsData, config) {
    $scope.newsPopUp = false;
    $scope.params = {
        pageNumber: 1,
        pageSize: 6,
        orderBy: '-date'
    };
    $scope.monthsLocale = blogService.monthsLocale;

    $scope.posts = postsData.posts;
    $scope.totalCount = postsData.totalCount;
    blogService.buildPreviewDate($scope.posts);

    $scope.showNewsPopUp = function (post) {
        $scope.newsPopUp = !$scope.newsPopUp;
        if ($scope.newsPopUp) {
            $scope.postPreview = post;
        } else {
            $scope.postPreview = undefined;
        }
    };

    $scope.pageChanged = function (page) {
        $scope.params.pageNumber = page;
        getData();
    };

    function getData() {
        blogService.getPosts($scope.params).then(function (reponse) {
            $scope.posts = reponse.posts;
            $scope.totalCount = reponse.totalCount;
            blogService.buildPreviewDate($scope.posts);
        });
    }
}]);
app.controller('GalleryController', ['$scope', 'config', 'gallery', function ($scope, config, gallery) {
    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;
}]);
app.controller('HomeController', ['$scope', '$timeout', 'postsData', 'config', 'gallery', 'blogService', function ($scope, $timeout, postsData, config, gallery, blogService) {
    $scope.posts = postsData.posts;
    $scope.totalCount = postsData.totalCount;
    $scope.activeIndex = 0;
    blogService.buildPreviewDate($scope.posts);

    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;

    $scope.selectedPost = $scope.posts.length ? $scope.posts[0] : false;

    $scope.selectPost = function (post, index) {
        $scope.selectedPost = post;
        $scope.activeIndex = index;
    };
}]);
app.controller('LayoutController', ['$scope', 'contactService', '$translate', function ($scope, contactService, $translate) {
    $scope.homeLoader = true;
    $scope.date = new Date();
    $scope.message = {};

    $scope.dropdownVisible = false;

    $scope.changeLanguage = function (key) {
        $translate.use(key);
        $scope.dropdownVisible = false;

        if (key == 'srb') {
            $scope.activeLanguage = 'srb';
        } else {
            $scope.activeLanguage = 'eng';
        }
    };

    $scope.changeLanguage('srb');

    $scope.showDropdown = function ($event) {
        $scope.dropdownVisible = !$scope.dropdownVisible;
    }

    $scope.contact = function () {
        $scope.loader = true;
        $scope.contactMessage = '';

        contactService.send($scope.message).then(function () {
            $scope.loader = false;
            $scope.contactMessage = 'Thank you. We will contact you shortly.';
        },
        function () {
            $scope.contactMessage = 'Something went wrong, please try again.';
        });
    };

    $scope.hamburgerMenu = false;

    $scope.showMenu = function () {
        $scope.hamburgerMenu = !$scope.hamburgerMenu;
    };

    $scope.goToSlide = function (slide) {
        var slide = parseInt(slide);
        $('#active-header-img').slick('slickGoTo', slide);
    };

    $scope.headlineAnimation = {
        offset: 150,
        transitionTime: '1000',
        targetOpacity: 1,
        transformation: 'fromScale',
        translateValue: '50px',
        scaleValue: '0.5'
    };

    $scope.bodyTextAnimation = {
        offset: 150,
        transitionTime: '1000',
        transformation: 'fromBottom',
        translateValue: '50%',
        targetOpacity: 1
    };

    $scope.rightAnimation = {
        offset: 500,
        targetOpacity: 1,
        transitionTime: '500',
        transformation: 'fromRight',
        translateValue: '50px',
    };

    $scope.leftAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '500',
        transformation: 'fromLeft',
        translateValue: '50px',
    };

    $scope.fadeInAnimation = {
        offset: 280,
        targetOpacity: 1,
        transitionTime: '1700',
    };

    $scope.leftBottleAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '1000',
        transformation: 'fromLeft',
        translateValue: '200px',
    };

    $scope.rightBottleAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '1000',
        transformation: 'fromRight',
        translateValue: '200px',
    };

    var imgHome = new Image();
    imgHome.src = '../../../assets/images/slide1.jpg';

    imgHome.onload = function () {
        $scope.homeLoader = false;
        $scope.$apply();
    };
}]);
app.controller('RedWinesController', ['$scope', '$timeout', '$state', function ($scope, $timeout, $state) {

    $timeout(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage').fullpage();
    });

    $scope.changeState = function () {
        $state.go('layout.wines');
    };
}]);
app.controller('TerritoryController', ['$scope', function ($scope) {
}]);
app.controller('VineyardsController', ['$scope', function ($scope) {
}]);
app.controller('VisitWineryController', ['$scope', function ($scope) {

    $scope.map = {
        center: {
            latitude: 39.8282,
            longitude: -98.5795
        },
        zoom: 10
    };

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 39.8282,
            longitude: -98.5795
        },
        options: {
            icon: '/assets/images/map-marker.png'
        }
    };

    $scope.options = {};
}]);
app.controller('WhiteWinesController', ['$scope', '$timeout', '$state', function ($scope, $timeout, $state) {

    $timeout(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage-white').fullpage();
    });

    $scope.changeState = function () {
        $state.go('layout.wines');
    };

}]);
app.controller('WineryController', ['$scope', function ($scope) {
}]);
app.controller('WinesController', ['$scope', function ($scope) {

    $scope.hamburgerMenu = false;

    $scope.showMenu = function () {
        $scope.hamburgerMenu = !$scope.hamburgerMenu;
    };
}]);
app.directive('scrollToSection', ['$timeout', '$compile', '$state', function ($timeout, $compile, $state) {
    return {
        restrict: 'A',
        scope: { sectionToScroll: '@', time: '@', state: '@' },
        link: function (scope, element, attrs) {
            $(element).on("click", function () {

                if ($state.current.name != scope.state) {
                    $state.go(scope.state);
                }

                $timeout(function () {
                    $('html,body').animate({
                        scrollTop: $('.' + scope.sectionToScroll).offset().top
                    }, scope.time);
                }, 100);
            });
        }
    }
}]);
app.directive("scrollTrigger", ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            animationSettings: '=',
            animationDelay: '='
        },
        link: function (scope, element, attrs) {
            if ($(window).width() > 1024) {
                if (scope.animationSettings.targetOpacity) {
                    element.css({
                        'opacity': '0',
                    });
                }
            }
            if ($(window).width() > 1024) {
                switch (scope.animationSettings.transformation) {
                    case 'fromLeft':
                        element.css({
                            'transform': 'translateX(-' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromRight':
                        element.css({
                            'transform': 'translateX(' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromTop':
                        element.css({
                            'transform': 'translateY(-' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromBottom':
                        element.css({
                            'transform': 'translateY(' + scope.animationSettings.translateValue + ')'
                        });
                    case 'fromScale':
                        element.css({
                            'transform': 'scale(' + scope.animationSettings.scaleValue + ')'
                        });
                        break;
                    default:
                }
            }

            var visibility = false;
            if ($(window).width() > 1024) {
                var scrollOffset = scope.animationSettings.offset;
            }

            executeAnimation();
            $($window).bind("scroll", executeAnimation);


            function executeAnimation() {
                var scrollPosition = $(window).scrollTop() + $(window).height() - scrollOffset;
                var elementPosition = element.offset().top;
                if (scrollPosition > elementPosition) {
                    visibility = true;
                }

                if (visibility && scope.animationSettings.transformation) {
                    $timeout(function () {
                        element.css({
                            'opacity': scope.animationSettings.targetOpacity,
                            'transform': 'translateY(0) translateX(0) scale(1)',
                            '-webkit-transition': 'all ' + scope.animationSettings.transitionTime + 'ms',
                            'transition': 'all ' + scope.animationSettings.transitionTime + 'ms'
                        });
                    }, scope.animationDelay);
                }
                else if (visibility) {
                    $timeout(function () {
                        element.css({
                            'opacity': scope.animationSettings.targetOpacity,
                            '-webkit-transition': 'all ' + scope.animationSettings.transitionTime + 'ms',
                            'transition': 'all ' + scope.animationSettings.transitionTime + 'ms'
                        });
                    }, scope.animationDelay);
                }
            }
        }
    };
}]);


app.directive('setHeight', function () {
    return function (scope, element, attrs) {
        element.height($(window).height());
        var windowWidth = $(window).width();

        $(window).bind('resize', function () {

            if ($(window).width() > 767) {
                element.height($(window).height());
            }
            else {
                if ($(window).width() != windowWidth) {
                    windowWidth = $(window).width();
                    element.height($(window).height());
                }
            };
        });
    }
});
app.directive('slickCarousel', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
        restrict: 'E',
        scope: {
            dots: '=',
            prevArrow: '@',
            nextArrow: '@'
        },
        link: function (scope, element, attrs) {
            scope.initialized = true;

            var initiateSlider = function () {
                element.slick({
                    infinite: true,
                    dots: scope.dots,
                    prevArrow: $('.' + scope.prevArrow),
                    nextArrow: $('.' + scope.nextArrow),
                    swipe: false,
                    fade: true,
                    speed: 1000,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    pauseOnHover: false,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                swipe: true,
                                fade: false,
                                speed: 500,
                            }
                        }
                    ]
                });
            };

            if (!element.hasClass('responsive')) {
                $timeout(function () {
                    initiateSlider();
                    gallerySlider();
                }, 200);
            }

            function gallerySlider() {
                if ($(window).width() < 769) {
                    $('.responsive').slick({
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        speed: 300,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        pauseOnHover: false,
                        responsive: [
                           {
                               breakpoint: 769,
                               settings: {
                                   dots: true,
                                   slidesToShow: 3,
                                   slidesToScroll: 2,
                                   swipe: true,
                               }
                           },
                           {
                               breakpoint: 690,
                               settings: {
                                   dots: true,
                                   slidesToShow: 1,
                                   slidesToScroll: 1,
                                   swipe: true,
                               }
                           }
                        ]
                    });
                };
            }

            $(window).bind('resize', function () {
                if ($(window).width() < 769) {
                    if (scope.initialized) {
                        scope.initialized = false;
                        gallerySlider();
                    }
                }
                else if ($('.responsive').hasClass('slick-initialized')) {
                    scope.initialized = true;
                    $('.responsive').slick('unslick');
                }
            });
        }
    }
}]);
app.factory('blogService', ['$http', '$q', 'config', function ($http, $q, config) {
    var factory = {};

    factory.monthsLocale = {
        'Jan': 'јан',
        'Feb': 'феб',
        'Mar': 'мар',
        'Apr': 'апр',
        'May': 'мај',
        'Jun': 'јун',
        'Jul': 'јул',
        'Aug': 'авг',
        'Sep': 'сеп',
        'Oct': 'окт',
        'Nov': 'нов',
        'Dec': 'дец'
    };

    factory.getPosts = function (params) {
        return $http({
            url: config.baseAddress + 'post/getAllPublic',
            method: 'GET',
            params: params
        }).then(function (res) {
            return res.data;
        }, function (err) {
            throw err.message;
        });
    };

    factory.buildPreviewDate = function (posts) {
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].postImages && posts[i].postImages.length) {
                posts[i].imageUrl = config.contentAddress + 'Posts/' + posts[i].id + '/' + posts[i].postImages[0].filePath;
            }
            posts[i].dateDay = moment.utc(posts[i].date).local().format("DD");
            posts[i].dateMonth = factory.monthsLocale[moment.utc(posts[i].date).local().format("MMM")];
        }
    }

    return factory;
}]);
app.factory('contactService', ['$http', '$q', 'config', function ($http, $q, config) {
    var factory = {};

    factory.send = function (message) {
        return $http({
            url: config.baseAddress + 'mail/contact',
            method: 'POST',
            headers: { 'Authorization': '5186abe1-71ca-4e21-9a16-02eb749ba8d5' },
            data: message
        }).then(function (res) {
            return res.data;
        }, function (err) {
            throw err.message;
        });
    };

    return factory;
}]);
app.factory('galleryService', ['$http', '$q', 'config', function ($http, $q, config) {
    var factory = {};

    factory.getImages = function (params) {
        return $http({
            url: config.baseAddress + 'gallery/getAll',
            method: 'GET',
            params: params
        }).then(function (res) {
            return res.data;
        }, function (err) {
            throw err.message;
        });
    };

    return factory;
}]);
angular.module('app.translations', []).constant('translations', {
    srb: {
        'scroll': 'Скролуј доле',
        'home': 'почетна',
        'visit-winery': 'Посета винарији',
        'news': 'Актуелности',
        'deliblato-sands': 'делиблатска пешчара',
        'gallery': 'Галерија',
        'menu': 'Мени',
        'pages': 'странице',
        'contact': 'контакт',
        'call': 'позовите',
        'email': 'Пошаљите',
        'address': 'пронађите нас',
        'view map': 'Прикажи путању',
        'name': 'Ваше име',
        'conatct-email': 'Ваш емаил',
        'message': 'Ваша порука',
        'send': 'Пошаљи',
        'copyright': 'Сва права задржана - Винарија Ђорђе',
        'welcome': 'Добро Дошли',
        'winery': 'Винарија',
        'home-content1': 'На југу Балкана, између Дунава и Карпата, простире се Делиблатска пешчара, заштићено прибежиште за многе врсте биљака и животиња и значајан генетски ресусрс наше планете.',
        'home-content2': 'У оквиру овог, лепог и веома интересантног природног амбијента настала је Винарија ЂОРЂЕ, породични подрум лоциран на северно-западном ободу Делиблатске пешчаре, у оквиру насеља Девојачки бунар.',
        'home-content3': 'Специфични микроклиматски услови, песковито земљиште изузетних минералних карактеристика и наша преданост у узгоју винограда обезбеђују огроман потенцијал за производњу вина врхунског квалитета.',
        'home-content4': 'Наш циљ је да благородни потенцијал Делиблатске пешчаре преточимо у врхунска вина која ће имати специфични карактер овог поднебља.',
        'red': 'Црвена',
        'white': 'Бела',
        'wine': 'Вина',
        'see-more': 'види још',
        'read-more': 'прочитај још',
        'freska': 'Фреска',
        'portugieser': 'Португизер',
        'merlot': 'Мерло',
        'frankovka': 'ФРАНКОВКА',
        'chardonnay': 'Шардоне',
        'sauvignon': 'Совињон бели',
        'rebo': 'РЕБО',
        'traminac': 'Траминац мирисни',
        'burgunac': 'БУРГУНДАЦ СИВИ',
        'burgunac-crni': 'БУРГУНДАЦ ЦРНИ',
        'kaberne': 'КАБЕРНЕ СОВИЊОН',
        'vineyards': 'Виногради',
        'idea': 'Идеја',
        'idea1': 'Идеја за озбиљну породичну винарију родила се 2010. године. Већ наредне године смо почели са изградњом винарије, проширивањем винограда и стварањем других услова за реализацију читавог концепта. Винарија ЂОРЂЕ је основана 2014. године иако као породица имамо прегршт искуства у производњи вина.',
        'idea2': 'Пре свега, наша идеја је да благородни потенцијал веома специфичног земљишта и микроклиме Делиблатске пешчаре преточимо у исто тако специфична вина која ће имати карактер овог поднебља. У том погледу јако нам је битно да произведемо грожђе врхунског квалитета како би у прозводњи вина примењивали што је могуће мање енолошких средстава и тиме обезбедили да се специфичности наше микролокације задрже и у нашем вину.',
        'location': 'Локација',
        'location1': 'Винарија ЂОРЂЕ своју производњу базира на преради грожђа које потиче искључиво из сопствених породичних винограда укупне површине 12,5 ха.',
        'location2': '  Винарија се налази у викенд насељу Девојачки бунар, недалеко од места Банатски Карловац, на северо-западном ободу Делиблатске пешчаре. Овај јединствени грађевински објекат налази се испод самог винограда што омогућава веома брзу прераду тек убраног грожђа. Ово је посебно битно јер се тиме постиже максимално очување природних арома сваке појединачне сорте грожђа. Из истог разлога, берба грожђа се обавља искључиво ручно.',
        'location3': ' Ентеријер винарије је уређен по угледу на старе банатске куће, пуне топлине и атмосфере која сваком посетиоцу пружа јединствени доживљај. Овим смо се потрудили да свим љубитељима вина као и самом нашем вину пружимо посебан ужитак током боравка у нашем подруму.',
        'production': 'Производња',
        'production1': 'Принцип производње грожђа је традиционални уз минималну употребу енолошких средстава и примену појединих тековина модерне технологије у производњи вина као што су: контрола температуре ферментације и мацерације, примена селекционисаних квасаца, употреба модерних софистицираних пумпи за претакање вина које минимално „малтретирају“ вина, хладна стабилизација вина и слично.',
        'production2': 'Примена технологије производње врхунских вина и контрола квалитета свих вина одвија се под будним оком нашег енолога-консултанта Александра Стојаковића.',
        'production3': 'Капацитет винарије је 30.000 литара вина са могућношћу проширења допремањем до 100.000 литара. Берба 2015. године је наша „нулта“ берба јер је са винима из ове бербе Винарија ЂОРЂЕ први пут наступила на националном тржишту.',
        'visiting': 'Посетите Винарију',
        'visiting1': 'У могућности смо да угостимо мање и веће групе посетилаца саседећим капацитетом на отвореном од 60 места и затвореном 80 места. Уз дегустацију наших вина, служимо и традиционална војвођанска предјела типична за Јужни Банат.',
        'vineyards-cont1': 'Винарија ЂОРЂЕ своја вина производи искључиво од грожђа пореклом из сопствених породичних винограда лоцираних у непосредној близини винарије.',
        'vineyards-cont2': 'Виногради су формирани почев од 2006. до 2012. године на укупној површини од око 12,5 ха. На овој површини узгајамо неке од најпознатијих врхунских сорти грожђа али и неке, нама веома драге, аутохтоне сорте карактеристичне за поднебље Јужног Баната и Војводине.',
        'soil': 'Земљиште',
        'soil-cont1': 'Виногради су подигнути на веома специфичном земљишту, јединственом у Европи. Овакво, изразито песковито земљиште, богато минералима и кречњаком уз веома специфичне микроклиматске услове Делиблатске пешчаре омогућава производњу вина врхунског квалитета и јединственог карактера.',
        'soil-cont2': 'Посебан куриозитет представља површински слој жутог песка који омогућава, готово идеалну рефлексију сунчевих зрака, као и борова шума којом су виногради окружени која ствара несвакидашњи амбијент за узгој винове лозе. Поднебље или како французи кажу „terroir“ је оно што вину даје посебност, личност, изворност и природност. Вина направљена од исте врсте грожђа узгајаних на различтим поднебљима никада не могу бити иста. С друге стране, вина имају значајну улогу у презентовању одређеног поднебља ширем друштвеном и нарочито међународном аудиторијуму. Берба грожђа се обавља искључиво ручно.',
        'white-grape': 'Беле сорте грожђа',
        'red-grape': 'Црне сорте грожђа',
        'visit-cont1': 'Винарија ЂОРЂЕ је смештена у прелепом природном амбијенту познатог викенд насеља Девојачки бунар, на северо-западном ободу Делиблатске пешчаре.',
        'visit-cont2': 'Благо таласасти предео прекриврен еолским наносима песка, испресецан степским растињем и јединственом четинарском шумом, чине ову локацију заиста другачијом од других. Далеко од индустријског окружења, а опет недалеко од магисталног пута Београд – Темишвар, Девојачки бунар представља посебну природну оазу лако доступну свим посетиоцима из великих градских центара. До винарије се може стићи за свега сат времена вожње од Беорада, сат и по вожње од Новог Сада и пола сата вожње од Панчева или Вршца.',
        'visit-cont3': 'Делиблатска пешчара је заштићено природно добро, Специјални резерват природе, представља прибежиште за многе врсте биљака и животиња и значајни генетски ресурс наше планете.',
        'visit-cont4': 'У оквиру винарије, свим посетиоцима и љубитељима вина, поред дегустације актуелних вина нудимо дневни предах у пријатном амбијенту породичног имања са погледом на виноград и прелепи крајолик.',
        'visit-cont5': 'Такође, у могућности смо да угостимо мање и веће групе посетилаца са седећим капацитетом на отвореном од 60 места и затвореном 80 места. Уз дегустацију наших вина, служимо и традиционална војвођанска предјела типична за Јужни Банат.',
        'visit-cont6': 'Пријем посетилаца вршимо искључиво уз претходну најаву путем телефона или имејла.',
        'call': 'позовите',
        'send': 'Пошаљи',
        'deliblatska-title': 'Делиблатска Пешчара - Специјални резерват природе',
        'deliblatska-cont1': 'Поднебље или како французи кажу "terroir" је оно што вину даје посебност, личност, изворност и природност. Вина направљена од исте врсте грожђа узгајаних на различтим поднебљима никада не могу бити иста. С друге стране, вина имају значајну улогу у презентовању одређеног поднебља ширем друштвеном и нарочито међународном аудиторијуму.',
        'deliblatska-cont2': 'Баш из претходно наведених разлога, посебну пажњу посвећујемо нашем тероару и желимо да га презентујемо онаквим какав заправо и јесте.',
        'deliblatska-cont3': 'Делиблатска пешчара се налази у југоисточном делу панонске низије, у Јужном Банату, и представља највећу европску континенталну пешчару која обухвата близу 35.000 хектара површине. Елипсастог је облика и оријентисана је у правцу југоисток-северозапад. Настала је током леденог доба од моћних наслага песка. У савременом периоду ветар Кошава обликовао је изражен дински рељеф (еолски рељеф), чије су надморске висине између 70 и 200 метара.',
        'flora': 'Флора',
        'flora-cont1': 'У јединственом мозаику екосистема, налазе се типичне врсте флоре и фауне од којих су многе природне реткости значајне по међународним критеријумима. Богата флора са преко 900 врста, подврста и варијетета обилује раритетима, реликтима, ендемима као што су банатски божур, панчићев пелен и клека – једини самоникли четинар панонске низије. Као последња и највећа оаза пешчарско-степске, шумске и мочварне вегетације која је некада доминирала панонском низијом, Делиблатска пешчара је један од најважнијих центара биодиверзитета у Европи.',
        'fauna': 'Фауна',
        'fauna-cont1': 'Међу реткостима фауне истичу се врсте са степских станишта: пустињски мрави, банатски соко, орао крсташ, степски скочимиш, текуница, слепо куче, степски твор и друге. За неке од њих, Делиблатска пешчара је једино станиште у Србији. Специфичност Резервата је и стална популација вука.',
        'fauna-cont2': 'У заштићеном природном добру налази се део реке Дунав са ритовима и адама. Воде богате рибом и мрестилишта значајно су стециште и масовно зимовалиште птица водених станишта, због чега је Делиблатска пешчара 1989. године проглашена за међународно значајно станиште птица. Овде се гнезде многе ретке врсте: мала бела чапља, жута чапља, ибис и ласта брегуница. Мали корморан – глобално угрожена врста  – ту има једино стабилно гнездилиште. Типична села на ободу заштићеног природног добра чувају атмосферу минулих времена и употпуњују слику овог живописног предела.',
        'fauna-cont3': 'Занимљиво је да су се култни филмови  "Ко то тамо пева" и "Бој на Косову" снимани баш у Делиблатској пешчари. Природне карактеристике и јединственост овог краја чине га погодним за рекреацију, лов и риболов, а пре свега  еколошки туризам.',
        'klima': 'Клима',
        'klima-cont1': 'Делиблатска пешчара се разликује од своје околине у морфолошком и вегетацијском погледу што се одражава и на климу због  чега се јављају микроклиматске разлике између пешчаре и њене околине. Пешчара има умерено-континенталну климу са наглашеним степским особинама.',
        'klima-cont2': 'Дневно као и годишње колебање температуре у Делиблатској пешчари је велико. Загревање песка је дању и лети јако због чега температуре достижу и 60ºЦ.',
        'klima-cont3': 'Ноћу и зими температура знатно опада. Годишње колебање температуре у пешчари износи 80ºЦ.  Средња годишња температура креће се креће се од 9,5ºЦ до 11ºЦ.',
        'klima-cont4': 'Интересантно је истаћи да се клима Делиблатске пешчаре подудара са Златиборском климом. Ноћи су хладне са доста росе а дани топли и суви са релативном влажношћу од 26%. Притисак је променљив и креће се од 886 - 1о28мб. Просечна сума годишњих падавина износи 633мм. Најмање падавина је у јулу, августу и септембру. Просечан број сунчаних сати је 2150 годишње.',
        'first-card': 'Погледајте актуелни асортиман наших вина са детаљним описима и предлозима за упаривање са храном.',
        'second-card': 'Идеја за озбиљну породичну винарију родила се 2010. године. Већ наредне године смо почели са...',
        'third-card': 'Винарија ЂОРЂЕ своја вина производи искључиво од грожђа пореклом из сопствених ...',
        'fourth-card': 'Винарија ЂОРЂЕ је смештена у прелепом природном амбијенту познатог викенд насеља Девојачки...',
        'fifth-card': ' Прво учешће Винарије ЂОРЂЕ на "International Wine Challenge AWC VIENNA" донело нам је и прву медаљу!',
        'menu': 'Мени',
        'freska-crvena': 'Фреска Црвена',
        'freska-bela': 'Фреска Бела',
        'berba': 'берба',
        'order': 'поручите',
        'dry-wine': 'Црвено суво вино.',
        'freska-cont1': 'Веома свежа купажа у којој доминира Франковка уз зачинске ноте Реба. Вино изузетне црвене боје са прелепим љубичастим одсјајем. На мирису веома воћно међу којим доминира зрела трешња. На укусу је заводљиво и питко, средњег тела и веома богатог екстрата. Прелепи благи танини, воћна складност и пријатне свеже киселине преливају се у веома пријатну завршницу богату бобичастим воћем.',
        'freska-cont2': 'Одлично се слаже уз домаће гулаше и паприкаше, димљено и сушено месо, зреле сиреве, пасте са месом и парадајзом, пачетином и ћуретином.',
        'temp': 'Температура сервирања:',
        'alcohol': 'Алкохол:',
        'portu-cont1': 'Црвено вино прелепе рубин боје, лепршаво, лагано и изузетно питко.',
        'portu-cont2': 'На мирису се истичу ароме зрелог воћа, нарочито јагоде. На укусу се препознаје блага сласт и посебне воћне ноте које заокружују лепе киселине и чине ово вино свежим и сочним. Ради се о веома специфичном Португизеру који одише карактеристичном раздраганошћу типичној за ову сорту грожђа, а опет заиста другачијем од свих других у Србији.',
        'portu-cont3': 'Ово је право вино за уживање јер не тражи храну, већ само добро друштво. Благо расхлађено, изузетно пријатно у летњим условима. Веома лепо се може упарити са младим сиревима, домаћим кобасицама, тадиционалним војвођанским предјелима, тестенинама и комбинованим салатама.',
        'merlo-cont1': 'Вино интензивне, дубоке рубин црвене боје. Веома равијен комплекс воћних мириса у којем се посебно истичу купина и дивља трешња. На укусу пуно, глатко, постојано, одлично балансирано уз прелепе нежне и баршунасте танине.',
        'merlo-cont2': 'Веома лепо се слаже уз ћуретину, пачетину, младо печење, зреле сиреве, печену говедину и нарочито уз чоколадне десерте.',
        'merlo-cont3': 'Препорука декантирања: 30 минута.',
        'dry-white': 'Бело суво вино.',
        'fb-cont1': 'Веома специфична купажа Бургундца сивог и Шардонеа. Бело вино нетипичне сламнато жуте боје са израженим бакарним тоновима. На мирису интензивно и живописно, веома постојано, богато секундарним аромама крушке, меда и свежег бадема. На укусу снажно, пуног тела, слојевито, веома лепо заокружено. Иако са доста алкохола веома питко, са израженом слашћу минералног карактера и веома лепим киселинама које му дају посебну свежину. Завршница је воћна, дуга и слојевита.',
        'fb-cont2': 'Веома лепо се слаже са пикантним морским плодовима, туном и речном рибом, пилетином и ћуретином у слатко-сланим сосевима, тврдим козјим сиревима, печеним кестеном, умерено слатким колачима.',
        'chard-cont1': 'Вино сламнато жуте боје. На мирису испреплетано минералним и деликатним воћним аромама. На укусу веома воћно, хармонично, пуно, са веома пријатним и хрскавим киселинама. У позадини извире веома блага доза воћне сласти. Завршница је освежавајућа, уз префињене ноте цитруса.',
        'chard-cont2': 'Препоручујемо га за конзумцију уз летње салате, речну и морску рибу, плодове мора, мекане сиреве, бело месо, десерте са крушкама и јабукама, и воћне суве колаче.',
        'traminac-cont1': 'Траминац мирисни је вино светло жуте боје са златастим одсјајем кристалне бистрине. Мирисаво, мекано вино са израженим прелепим аромама беле брескве, диње и беле руже. Ови мириси се нежно претачу у магичан слаткасти укус кандираног воћа који пружа посебно задовољство у завршници. Вино је изузетно питко, средњег тела, кремасто, са добро балансираним алкохолом и киселинама.',
        'traminac-cont2': 'Може бити идеалан аперитив али се одлично слаже са плодовима мора, димљеном рибом, летњим салатама, белим месом, воћем и воћним десертима.',
        'sauvignon-cont1': 'Вино сламнато жуте боје, кристалне бистрине, са богатим ароматским комплексом. Свеже, елегантно вино у којем се на мирису истичу ароме виноградарске брескве, зове и цитруса. Савршено прија на високим летњим температурама. Вино је средњег тела, лако покретљиво у чаши, изузетно питко, са благим тоновима сласти, добро избалансираним киселинама и прелепом воћном завршницом.',
        'sauvignon-cont2': 'Препоручујемо га уз рибу, пасте са морским плодовима, летње салате, сиреве, суве смокве и суве колаче.',
    },

    en: {
        'scroll': 'Scroll down',
        'home': 'home',
        'visit-winery': 'Visiting the winery',
        'news': 'News',
        'deliblato-sands': 'deliblato sands',
        'gallery': 'gallery',
        'menu': 'menu',
        'pages': 'pages',
        'contact': 'contact',
        'call': 'call',
        'email': 'email',
        'view map': 'View map',
        'name': 'Your name',
        'conatct-email': 'Your email',
        'message': 'Your message',
        'send': 'Send message',
        'copyright': 'All rights reserved - WINERY DJORDJE',
        'welcome': 'welcome',
        'winery': 'Winery',
        'home-content1': 'In the south of the Balkans, between the Danube and Carpathian Mountains, stretches Deliblatska Pescara (Deliblato Sands), a protected shelter for a number of plants and animals and an important genetic resource of our planet.',
        'home-content2': 'Inside this beautiful and extremely interesting nature, our Winery “Djordje” came to existence as a family wine cellar located on the north-west ridge of Deliblatska Pescara, in the settlement of Devojacki Bunar (Girl’s Well).',
        'home-content3': 'Specific microclimate, sandy soil with extraordinary mineral characteristics and our commitment to wine growing provide enormous potential for production of top-quality wines.',
        'home-content4': 'Our aim is to use this precious potential of Deliblato Sands for production of top-quality wines that will have the specific character of this area.',
        'red': 'Red',
        'white': 'White',
        'wine': 'Wine',
        'see-more': 'see more',
        'read-more': 'read more',
        'freska': 'freska',
        'portugieser': 'Portugieser',
        'merlot': 'Merlot',
        'frankovka': 'Franc',
        'chardonnay': 'Chardonnay',
        'sauvignon': 'Sauvignon Blanc',
        'rebo': 'Rebo',
        'traminac': 'Gewurztraminer',
        'burgunac': 'Pinot Gris',
        'burgunac-crni': 'Pinot Noir',
        'kaberne': 'Cabernet Sauvignon',
        'vineyards': 'Vineyards',
        'idea': 'Idea',
        'idea1': 'The idea for a serious family winery was born in 2010. The following year we started building the winery, expanding the vineyard and creating other conditions for the implementation of the entire plan. Winery DJORDJE was founded in 2014, even though, as a family, we have plenty of experience in wine production.',
        'idea2': 'First of all, our idea is to use this precious potential of very specific soil and microclimate of Deliblato Sands for production of equally specific wines that will have the character of this area. In this respect, it is very important to us to produce superior quality grapes in order to use as few as possible oenological tools in wine production and thus ensure that the specificities of our micro-location are kept in our wines.',
        'location': 'Location',
        'location1': 'Wine production in our Winery DJORDJE is based on processing the grapes collected exclusively from our family vineyards covering the total area of 12.5 hectares.',
        'location2': 'The winery is located in the weekend resort known as the Girl’s Well, in the vicinity of the town of Banatski Karlovac, on the north-west slope of Deliblato Sands. Facilities of the winery are unique and are located just below the vineyard, which enables high-speed processing of freshly picked grapes. This is particularly important because it helps us achieve the maximum preservation of the natural aroma of each grape variety. For the same reason, the grape harvest is done exclusively by hand.',
        'location3': 'The interior of the winery is modeled as old Banat house, full of warmth and atmosphere that gives each visitor a unique experience. This is the result of our attempt to offer especially pleasurable experience to all wine lovers during their stay in our cellar.',
        'production': 'Production',
        'production1': 'The principle of wine production is traditional with minimal use of oenological tools and the implementation of certain achievements of modern technology in wine production such as: control of fermentation and maceration temperature, the use of selected yeasts, use of modern sophisticated wine decanting pumps that minimally "harass" wine, cold stabilization of wines and the like.',
        'production2': 'The capacity of our winery is 30,000 liters of wine per year, with the possibility to expand it up to 100,000 liters.',
        'production3': 'The harvest of 2015 is considered our "zero" harvest, because our Winery DJORDJE debut on the national market was with the wines from this vintage.',
        'visiting': 'VISITING WINERY',
        'visiting1': 'We are able to host small and large groups of visitors offering 60 seats outdoors and 80 seats indoors. While tasting our wines, the visitors are offered some traditional Vojvodina appetizers typical for the South Banat.',
        'vineyards-cont1': 'Winery ĐORĐE produces their wines exclusively from grapes originating from our own family vineyard located near the winery.',
        'vineyards-cont2': 'Vineyards were formed in the period from 2006 to 2012 on the total area of about 12.5 hectares. Here we grow some of the most exquisite varieties of grapes, but also some indigenous varieties, very dear to us, that are typical for the region of South Banat and Vojvodina.',
        'soil': 'Soil',
        'soil-cont1': 'The vineyards are raised on a very specific soil, unique in Europe. This very sandy soil, rich in minerals and limestone with very specific microclimate conditions of Deliblato Sands makes it possible to produce wines of high quality and unique character.',
        'soil-cont2': 'A special curiosity are the surface layer of yellow sand which allows almost perfect reflection of sunlight, and pine forests that surround the vineyards and form an unusual environment for growing grapes. Microclimate, or as the French say "terroir", is what gives the wine its specialty, personality, authenticity and naturalness. Wines made from the same type of grapes grown in different climates can never be the same. On the other hand, wines play an important role in presenting certain area to wider social and especially international audience. The grape is harvested exclusively by hand.',
        'white-grape': 'White grape varieties in our vineyards are:',
        'red-grape': 'Red varieties of grapes in our vineyards are:',
        'visit-cont1': 'Winery ĐORĐE is located in the beautiful natural settings of the famous weekend resort known as the Devojački bunar (Girls Well), on the north-western edge of Deliblatska peščara (Deliblato Sands).',
        'visit-cont2': 'Slightly wavy landscape, full of eolian sand dunes, crisscrossed by steppe vegetation and unique coniferous forest, makes this location really different from others. Far from the industrial environment, yet not too far from the regional road Belgrade - Timisoara, the Girl’s well represents a special natural oasis easily accessible to all visitors from large urban centers. The winery can be reached in just an hours drive from Belgrade, an hour and a half drive from Novi Sad and a half hour drive from Pancevo, or Vrsac.',
        'visit-cont3': 'Deliblato Sands is a protected natural area, a special nature reserve, and is a refuge for many species of plants and animals, and an important genetic resource of our planet.',
        'visit-cont4': 'Within the winery, all visitors and wine lovers, in addition to wine tasting, are offered a short daily break in the pleasant surroundings of the family estate overlooking the vineyard and the beautiful landscape.',
        'visit-cont5': 'Also, we are able to host small and large groups of visitors offering 60 seats outdoors and 80 seats indoors. While tasting our wines, the visitors are offered some traditional Vojvodina appetizers and meals typical for the South Banat.',
        'visit-cont6': 'Visits are possible only upon prior notification by telephone or e-mail.',
        'call': 'contact for visitors',
        'send': 'Send',
        'deliblatska-title': 'Deliblato Sands – Special Nature Reserve',
        'deliblatska-cont1': 'Climate, or as the French call it "terroir", is what gives wine its uniqueness, personality, authenticity and naturalness. Wines made from the same type of grapes grown in different climates can never be the same. On the other hand, wine plays an important role in representing certain area to a wider social and, especially, international audience.',
        'deliblatska-cont2': 'Just for the reasons stated above, we pay special attention to our “terroir”, and we wish to present it exactly as it is.',
        'deliblatska-cont3': 'Deliblato Sands (Deliblatska peščara) is located in the southeastern part of the Pannonian Plain, in the South Banat, and it represents Europes largest continental sand area covering nearly 35,000 hectares. It is elliptical in shape and is southeast – northwest oriented. It was formed during the Ice Age from vast sand deposits. In contemporary period, the southeastern wind, known in Serbia as ‘koshava’, shaped this expressed dune relief (Eolian relief), with altitudes between 70 and 200 meters.',
        'flora': 'Flora',
        'flora-cont1': 'This unique mosaic of ecosystems contains typical species of flora and fauna, many of which are rare and significant according to international criteria. The rich flora with over 900 species, subspecies and varieties abounds in rarities, relics, endemics such as the Banat peony, Pančić wormwood and juniper - the only autochthonous conifer of the Pannonian Plain. As the last and largest oasis of sand, steppe, forest and wetland vegetation that once dominated the Pannonian Plain, Deliblato Sands is one of the most important biodiversity centers in Europe.',
        'fauna': 'Fauna',
        'fauna-cont1': 'Rare fauna species include some from steppe habitats: desert ants, Banat falcon, imperial eagle, steppe jerboa, ground squirrel, mole rat, steppe skunk and others. For some of them, Deliblato Sands is the only habitat in Serbia. The specificity of the reserve is permanent wolf population.',
        'fauna-cont2': 'This protected natural area includes part of the Danube River with marshes and river islands. Waters rich in fish and hatcheries are an important gathering-point and mass winter habitat for waterfowl, which is why the Deliblato Sands was declared an International Important Bird Area in 1989. Here many rare bird species have their nests: Little egret, yellow heron, ibis and sand-martin. Small cormorant - a highly endangered species - has its only safe nesting place here. Typical villages on the periphery of the protected natural resource have kept the atmosphere of past times and make the picture of this picturesque landscape complete.',
        'fauna-cont3': 'It is interesting that the cult films "Who is Singing Over There" and "The Battle of Kosovo" were made in Deliblato Sands. Natural characteristics and uniqueness of this region make it suitable for recreation, hunting and fishing, and above all for ecological tourism.',
        'klima': 'Climate',
        'klima-cont1': 'Deliblato Sands is different from its surroundings in terms of morphology and vegetation, which is reflected on the climate and that’s why certain microclimate differences between Pescara and its surroundings occur. Pescara has a temperate continental climate with pronounced steppe characteristics.',
        'klima-cont2': 'Daily and annual temperature fluctuation in Deliblato Sands is big. Warming up of the sand during the day and in summer time is so high that the temperatures even reach 60ºC.',
        'klima-cont3': 'At night and in winter, the temperature drops considerably. Annual fluctuations in temperature here reach 80ºC. The average annual temperature ranges from 9.5ºC to 11ºC.',
        'klima-cont4': 'It is interesting to note that the climate of Deliblato Sands coincides with the Zlatibor climate. Nights are cold with plenty of dew and the days are warm and dry with relative humidity of 26%. The pressure is variable and ranges from 886-1o28mb. The average amount of annual rainfall is 633mm, with the lowest rainfall in July, August and September. The average number of sunny hours is 2,150 per year.',
        'first-card': 'Take a look at the current range of our wines with detailed descriptions and suggestions for pairing with food',
        'second-card': 'The idea for a serious family winery was born in 2010. The following year we started building ...',
        'third-card': 'Winery ĐORĐE produces their wines exclusively from grapes originating ...',
        'fourth-card': 'Winery ĐORĐE is located in the beautiful natural settings of the famous weekend resort known as...',
        'fifth-card': 'The first participation of wineries ĐORĐE the "International Wine Challenge AWC VIENNA" brought us the first medal!',
        'menu': 'Menu',
        'freska-crvena': 'Freska Red',
        'freska-bela': 'Freska White',
        'berba': 'vintage',
        'order': 'order',
        'dry-wine': 'Dry red wine.',
        'freska-cont1': 'Very fresh blend dominated by Frankovka (Blaufränkisch) with spicy notes of Reb. Wine of exquisite red colour with beautiful purple reflections. Wine of very strong aroma dominated by ripe cherry. The taste is seductive and smooth, medium bodied and of very rich extract. Beautiful gentle tannins, fruity consistency and pleasant fresh acid spill over in a very pleasant finish rich with berries.',
        'freska-cont2': 'It goes well with homemade stews and chowder, smoked and cured meats, aged cheeses, pasta with meat and tomatoes, duck and turkey.',
        'temp': 'Serving temperature:',
        'alcohol': 'Alcohol:',
        'portu-cont1': 'Red wine of beautiful ruby colour, airy, light and very drinkable.',
        'portu-cont2': 'The scent highlights aromas of ripe fruit, especially strawberries. The taste is recognizable by mild sweetness and special fruity notes which are rounded with nice acids making this wine fresh and juicy. It is a very specific Portugieser that exudes the glee typical of this grape variety, and yet really different from all others in Serbia.',
        'portu-cont3': 'This is the right wine for enjoyment because it does not require food, but only nice company. Slightly chilled, it is very pleasant in summer time. It can be very nicely paired with young cheeses, homemade sausages, creative traditional Vojvodina starters, pasta and mixed salads.',
        'merlo-cont1': 'Intensive deep ruby red colour. Very fruity aromatic complex, especially blackberry and wild cherry. The taste is rich medium to full bodied, long lasting, well balanced, with beautiful and soft and smooth tannins.',
        'merlo-cont2': 'Very good pairing with turkey, duck, old cheeses, roast beef and especially with chocolate desserts.  ',
        'merlo-cont3': 'Recommend decanting: 30 minutes',
        'dry-white': 'Dry white wine.',
        'fb-cont1': 'Very specific blend of Pinot Gris and Chardonnay. White wine of unconventionally straw yellow colour with strong copper tones. Wine of intense and lively scent, very steady, abundant in secondary aromas of pear, honey and fresh almonds. The taste is strong, full-bodied, layered, very well rounded. Even though it contains a lot of alcohol it is still very smooth, with pronounced sweetness of mineral character and very nice acids that give it a special freshness. The finale is fruity, long and layered.',
        'fb-cont2': 'Very nicely agrees with spicy seafood, tuna fish and freshwater fish, chicken and turkey in sweet and savory sauces, hard goat cheese, roasted chestnuts and not so sweet cakes.',
        'chard-cont1': 'The wine is straw yellow in colour. Its scent is interlace of mineral and delicate fruit flavours. The taste is very fruity, harmonious, full, with very pleasant and crisp acids. Very mild dose of fruity sweetness can be tasted in the background. The finale is refreshing, with subtle notes of citrus.',
        'chard-cont2': 'We recommend it with summer salads, freshwater and saltwater fish, seafood, soft cheeses, white meat, desserts with pears and apples, dry fruit and pastries.',
        'traminac-cont1': 'Gewürztraminer is light yellow wine with a golden glint of crystal clarity. Aromatic, soft wine with pronounced beautiful aromas of white peach, melon and white rose. These scents are gently transformed into the magical sweet taste of candied fruit that provides special pleasure in the final. The wine is very drinkable, medium bodied, creamy, with a well-balanced alcohol and acids.',
        'traminac-cont2': 'It can be an ideal aperitif but goes well with seafood, smoked fish, summer salads, white meats, fruit and fruity desserts.',
        'sauvignon-cont1': 'The wine is of straw yellow colour, crystal clear, with a rich aromatic complex. Fresh, elegant wine in which the aromas of vineyard peach, elder and citrus stand out. Perfectly suited for high summer temperatures, the wine is medium bodied, moving easily in the glass, extremely smooth, with slight tones of sweetness, well-balanced acids and beautiful fruity finish.',
        'sauvignon-cont2': 'We recommend it with fish, seafood pasta, summer salads, cheeses, dried figs and dry cakes.',
    }
});
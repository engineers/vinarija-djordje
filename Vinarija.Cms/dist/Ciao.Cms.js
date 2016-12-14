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
.config(['$urlRouterProvider', 'jwtInterceptorProvider', '$httpProvider', '$locationProvider', 'jwtOptionsProvider', 'localStorageServiceProvider', '$mdThemingProvider', function ($urlRouterProvider, jwtInterceptorProvider, $httpProvider, $locationProvider, jwtOptionsProvider, localStorageServiceProvider, $mdThemingProvider) {
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
            'cms.vinarijadjordje.rs',
            'enginee.rs'
        ],
        unauthenticatedRedirectPath: '/login'
    });

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(['$injector', '$q', 'localStorageService', '$rootScope', function ($injector, $q, localStorageService, $rootScope) {
        return {
            responseError: function (response) {
                var appConfig = $injector.get('config');
                var $http = $injector.get('$http');
                if ((response.status == 401 || response.status == 403) && response.config.url.startsWith(appConfig.baseAddress)
                    && response.data.message.toLowerCase().indexOf('token') != -1) {
                    localStorageService.remove('token');
                    delete $http.defaults.headers.common.Authorization;
                    $rootScope.session = {};
                    $state.go('login');
                }

                return $q.reject(response);
            }
        };
    }]);

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
}])
.run(['$rootScope', '$state', 'jwtHelper', '$mdToast', 'localStorageService', function ($rootScope, $state, jwtHelper, $mdToast, localStorageService) {
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
}]);

//app.constant('config', {
//    baseAddress: 'http://enginee.rs:8122/api/',
//    postImagesPath: 'http://enginee.rs:8122/Content/Posts/',
//    galleryImagesPath: 'http://enginee.rs:8122/Content/Gallery/',
//});

app.constant('config', {
    baseAddress: 'http://localhost:53491/api/',
    postImagesPath: 'http://localhost:53491/Content/Posts/',
    galleryImagesPath: 'http://localhost:53491/Content/Gallery/',
});

app.filter("correctedDate", function () {
    return function (date) {
        if (date) {
            return moment.utc(date).local().format("MM/DD/YYYY");
        }
    };
});
app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('layout.blog', {
        url: '/blog',
        controller: 'BlogController',
        templateUrl: 'app/sections/blog/blog.html',
        data: {
            requiresLogin: true
        }
    });
}])
.controller('BlogController', ['$scope', 'blogService', '$timeout', '$mdDialog', function ($scope, blogService, $timeout, $mdDialog) {
    $scope.params = { pageSize: 10, pageNumber: 1, orderBy: '-date' };
    loadData();

    $scope.onPaginate = function (pageNumber, pageSize) {
        $scope.params.pageNumber = pageNumber;
        $scope.params.pageSize = pageSize;
        loadData();
    };

    $scope.onReorder = function (sort) {
        $scope.params.sort = sort;
        loadData();
    };

    $scope.openModal = function (ev, post) {
        $mdDialog.show({
            controller: 'PostModalController',
            templateUrl: 'app/sections/blog/modals/postModal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            size: 'lg',
            clickOutsideToClose: true,
            locals: {
                post: angular.copy(post)
            }
        })
		.then(function (data) {
		    loadData();
		}, function () {
		});
    };

    $scope.removeModal = function (ev, post) {
        var confirm = $mdDialog.confirm()
		.title('Brisanje posta')
		.textContent('Da li ste sigurni da želite da obrišete post?')
		.ariaLabel('Brisanje')
		.targetEvent(ev)
		.ok('Da')
		.cancel('Ne');
        $mdDialog.show(confirm).then(function () {
            blogService.remove(post.id).then(function (res) {
                $scope.params.pageNumber = 1;
                loadData();
            });
        });
    };

    $scope.toggleActive = function (post) {
        blogService.activateDeactivate(post);
    };

    var filterTextTimeout;
    $scope.search = function () {
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
        filterTextTimeout = $timeout(function () {
            loadData();
        }, 250);
    };

    function loadData() {
        $scope.loading = true;
        $scope.promise = blogService.get($scope.params).then(function (res) {
            $scope.posts = res.posts;
            $scope.totalItems = res.totalCount;
            $scope.loading = false;
        }, function() {
            $scope.loading = false;
        });

        return $scope.promise;
    }
}]);

'use strict';
app.controller('PostModalController', ['$scope', '$mdDialog', 'blogService', 'post', 'FileUploader', 'config', 'localStorageService', 'taOptions', function ($scope, $mdDialog, blogService, post, FileUploader, config, localStorageService, taOptions) {
    taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
    ];

    $scope.imagePath = config.postImagesPath;

    $scope.uploader = new FileUploader({
        url: config.baseAddress + 'post/uploadImage',
        headers : {
            'Authorization': localStorageService.get('token')
        }
    });

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.uploader.onAfterAddingFile = function () {
        if ($scope.uploader.queue.length > 1) {
            $scope.uploader.queue.splice(0, 1);
        }
    };

    $scope.uploader.onBeforeUploadItem = function (item) {
        item.formData.push({'id': $scope.post.id});
    };
  
    $scope.uploader.onCompleteAll = function () {
        $scope.loading = false;
        $mdDialog.hide($scope.response);
    };

    $scope.post = post;
    if ($scope.post) {
        $scope.post.date = new Date(post.date);
    }

    $scope.store = function () {
        $scope.loading = true;
        var promise = $scope.post.id ? blogService.update($scope.post) : blogService.add($scope.post);
        promise.then(function (r) {
            $scope.response = r;
            $scope.$emit('toast', { message: 'Uspešno sačuvano!', type: 'success' });
            if ($scope.uploader.queue && $scope.uploader.queue.length) {
                $scope.post.id = r.id;
                $scope.uploader.uploadAll();
            } else {
                $mdDialog.hide($scope.response);
            }
        });
    };

    $scope.removeImage = function (image) {
        blogService.removeImage($scope.post.id, image).then(function (res) {
            $scope.post.postImages = [];
            $scope.$emit('toast', { message: 'Slika uspešno obrisana!', type: 'success' });
        });
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('layout.gallery', {
        url: '/gallery',
        controller: 'GalleryController',
        templateUrl: 'app/sections/gallery/gallery.html',
        data: {
            requiresLogin: true
        }
    });
}])
.controller('GalleryController', ['$scope', 'galleryService', '$timeout', '$mdDialog', 'FileUploader', 'config', 'localStorageService', function ($scope, galleryService, $timeout, $mdDialog, FileUploader, config, localStorageService) {
    $scope.oldGallery = [];

    $scope.slickConfig = {
        enabled: true,
        //autoplay: true,
        draggable: true,
        autoplaySpeed: 3000,
        method: {}
    };

    $scope.uploader = new FileUploader({
        url: config.baseAddress + 'gallery/uploadImage',
        headers: {
            'Authorization': localStorageService.get('token')
        }
    });

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.uploader.onAfterAddingFile = function (fileItem) {
        $scope.uploadingImages = true;
    };

    $scope.uploader.onCompleteAll = function () {
        $scope.uploadingImages = false;
        $scope.uploader.queue = [];
        loadData();
    };

    $scope.sortableOptions = {
        update: function (e, ui) {
            $scope.reordering = true;
        },
        start: function (e, ui) {
            $scope.refreshSlick = true;
            $scope.$apply();

        },
        stop: function (e, ui) {
            $scope.refreshSlick = false;
            $scope.$apply();
        },
        axis: 'y',
        helper: function (e, ui) {
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        },
        handle: '.fa-bars'
    };

    loadData();

    $scope.removeImage = function (ev, image) {
        var confirm = $mdDialog.confirm()
        .title('Brisanje slike')
        .textContent('Da li ste sigurni da želite da obrišete sliku?')
        .ariaLabel('Brisanje')
        .targetEvent(ev)
        .ok('Da')
        .cancel('Ne');
        $mdDialog.show(confirm).then(function () {
            galleryService.removeImage(image.id).then(function () {
                loadData();
                $scope.$emit('toast', { message: 'Slika uspešno obrisana!', type: 'success' });
            });
        });
    };

    $scope.cancelUpload = function () {
        $scope.uploader.queue = [];
        $scope.uploadingImages = false;
    };

    $scope.uploadImages = function () {
        $scope.uploader.uploadAll();
    };

    $scope.cancelReordering = function () {
        $scope.galleryImages = angular.copy($scope.oldGallery);
        $scope.reordering = false;
        $scope.refreshSlick = true;
        $timeout(function () {
            $scope.refreshSlick = false;
        }, 0);
    };

    $scope.saveReordering = function () {
        galleryService.saveReorder($scope.galleryImages).then(function () {
            loadData();
        });
    };

    $scope.openImagePreviewModal = function (ev, image) {
        $mdDialog.show({
            controller: 'ImagePreviewModalController',
            templateUrl: 'app/sections/gallery/modals/imagePreviewModal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            size: 'lg',
            clickOutsideToClose: true,
            locals: {
                image: angular.copy(image)
            }
        });
    };

    function loadData() {
        $scope.loading = true;
        $scope.refreshSlick = true;
        $scope.promise = galleryService.getImages().then(function (images) {
            _.each(images, function (image) {
                image.name = image.filePath.substring(image.filePath.indexOf("_") + 1);
                image.filePath = config.galleryImagesPath + image.filePath;
            });
            $scope.galleryImages = images;
            $scope.oldGallery = angular.copy($scope.galleryImages);
            $scope.loading = false;
            $scope.refreshSlick = false;
            $scope.reordering = false;

        }, function () {
            $scope.loading = false;
        });

        return $scope.promise;
    }
}]);

'use strict';
app.controller('ImagePreviewModalController', ['$scope', '$mdDialog', 'config', 'image', '$timeout', function ($scope, $mdDialog, config, image, $timeout) {
    $scope.image = image;

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('layout', {
        controller: 'LayoutController',
        templateUrl: 'app/sections/layout/layout.html',
        data: {
            requiresLogin: true
        }
    });
}])
.controller('LayoutController', ['$rootScope', '$scope', '$http', '$state', '$mdSidenav', 'localStorageService', function ($rootScope, $scope, $http, $state, $mdSidenav, localStorageService) {
    $scope.close = function () {
        $mdSidenav('left').close();
    };

    $scope.toggle = function () {
        $mdSidenav('left').toggle();
    };

    $scope.logout = function () {
        localStorageService.remove('token');
        delete $http.defaults.headers.common.access_token;
        $rootScope.session = {};
        $state.go('login');
    };
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'app/sections/login/login.html'
    });
}])
.controller('LoginController', ['$scope', '$state', 'adminService', 'localStorageService', function ($scope, $state, adminService, localStorageService) {
    $scope.user = {};

    $scope.login = function () {
        adminService.login($scope.user).then(function (response) {
            localStorageService.set('token', response.token);
            $state.go('layout.blog');
        });
    };
}]);

app.factory('adminService', ['$http', 'config', '$rootScope', '$q', function ($http, config, $rootScope, $q) {
    var factory = {};

    factory.login = function (params) {
        return $http({
            url: config.baseAddress + 'user/login',
            method: 'POST',
            data: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
            return $q.reject(response);
        });
    };

    return factory;
}]);

app.factory('blogService', ['$http', 'config', '$rootScope', function ($http, config, $rootScope) {
    var factory = {};

    factory.get = function (params) {
        return $http({
            url: config.baseAddress + 'post/getAll',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.get: ' + response.data.message;
        });
    };

    factory.add = function (data) {
        return $http({
            url: config.baseAddress + 'post/add',
            method: 'POST',
            data: data
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.add: ' + response.data.message;
        });
    };

    factory.update = function (data) {
        return $http({
            url: config.baseAddress + 'post/update',
            method: 'PUT',
            data: data
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.update: ' + response.data.message;
        });
    };

    factory.activateDeactivate = function (data) {
        return $http({
            url: config.baseAddress + 'post/activeDeactive',
            method: 'PUT',
            data: {
                postId: data.id,
                active: data.active
            }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message, type: 'danger' });

            throw 'blogService.update: ' + response.data.message;
        });
    };

    factory.remove = function (id) {
        return $http({
            url: config.baseAddress + 'post/delete',
            method: 'DELETE',
            params: { postId: id }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.remove: ' + response.data.message;
        });
    };

    factory.removeImage = function (postId, image) {
        return $http({
            url: config.baseAddress + 'post/removeImage',
            method: 'PUT',
            data: { postId: postId, postImageId: image.id }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.remove: ' + response.data.message;
        });
    };

    return factory;
}]);

app.factory('galleryService', ['$http', 'config', '$rootScope', '$q', function ($http, config, $rootScope, $q) {
    var factory = {};

    factory.getImages = function (params) {
        return $http({
            url: config.baseAddress + 'gallery/getAll',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
            return $q.reject(response);
        });
    };

    factory.removeImage = function (imageId) {
        return $http({
            url: config.baseAddress + 'gallery/removeImage',
            method: 'DELETE',
            params: {
                imageId: imageId
            }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
            return $q.reject(response);
        });
    };

    factory.saveReorder = function (images) {
        var galleryIds = images.map(function (image) {
            return image.id;
        });

        galleryIds.reverse();
        return $http({
            url: config.baseAddress + 'gallery/reorder',
            method: 'PUT',
            data: {
                galleryIds: galleryIds
            }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
            return $q.reject(response);
        });
    };

    return factory;
}]);

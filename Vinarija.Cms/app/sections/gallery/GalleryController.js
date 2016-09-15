app.config(function ($stateProvider) {
    $stateProvider.state('layout.gallery', {
        url: '/gallery',
        controller: 'GalleryController',
        templateUrl: 'app/sections/gallery/gallery.html',
        data: {
            requiresLogin: true
        }
    });
})
.controller('GalleryController', function ($scope, galleryService, $timeout, $mdDialog, FileUploader, config, localStorageService) {
    $scope.oldGallery = [];

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

    $scope.uploader.onAfterAddingFile = function () {
    };

    $scope.uploader.onCompleteAll = function () {
        $scope.uploadingImages = false;
        $scope.uploader.queue = [];
    };

    loadData();

    $scope.cancelUpload = function () {
        $scope.uploader.queue = [];
    };

    $scope.uploadImages = function () {
        $scope.uploader.uploadAll();
    };

    $scope.cancelReorder = function () {
        $scope.galleryImages = angular.copy($scope.oldGallery);
        $scope.reordering = false;
    };

    $scope.saveReorder = function () {
        galleryService.saveReorder().then(function () {
            loadData();
            $scope.reordering = false;
        });
    };

    function loadData() {
        $scope.loading = true;
        $scope.promise = galleryService.getImages().then(function (images) {
            _.each(images, function (image) {
                image.name = image.filePath.substring(image.filePath.indexOf("_") + 1);
                image.filePath = config.galleryImagesPath + image.filePath;
            });
            $scope.galleryImages = images;
            $scope.oldGallery = angular.copy($scope.galleryImages);
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
        });

        return $scope.promise;
    }
});

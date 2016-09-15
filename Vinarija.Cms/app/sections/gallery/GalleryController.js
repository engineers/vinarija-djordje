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
        $scope.uploadingImages = true;
    };

    $scope.uploader.onBeforeUploadItem = function (item) {
        item.formData.push({ 'id': $scope.post.id });
    };

    $scope.uploader.onCompleteAll = function () {
        $scope.uploadingImages = false;
        $mdDialog.hide($scope.response);
    };

    loadData();

    function loadData() {
        $scope.loading = true;
        $scope.promise = galleryService.getImages().then(function (images) {
            $scope.galleryImages = images;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
        });

        return $scope.promise;
    }
    
});

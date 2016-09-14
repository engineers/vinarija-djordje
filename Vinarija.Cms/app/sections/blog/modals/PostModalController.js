'use strict';
app.controller('PostModalController', function ($scope, $mdDialog, blogService, post, FileUploader, config, localStorageService, taOptions) {
    taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
    ];

    $scope.uploader = new FileUploader({
        url: config.baseAddress + 'post/upload',
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

    $scope.uploader.onBeforeUploadItem = function (item) {
        item.formData.push({'id': $scope.post.id});
    };
  
    $scope.uploader.onCompleteAll = function () {
        $scope.loading = false;
        $mdDialog.hide($scope.response);
    };

    $scope.post = post;

    $scope.store = function () {
        $scope.loading = true;
        var promise = $scope.post.id ? blogService.update($scope.post) : blogService.add($scope.post);
        promise.then(function (r) {
            $scope.response = r;
            $scope.$emit('toast', { message: 'Uspešno sačuvano!', type: 'success' });
            if ($scope.uploader.queue && $scope.uploader.queue.length) {
                $scope.post.id = r.payload.id;
                $scope.uploader.uploadAll();
            } else {
                $mdDialog.hide($scope.response);
            }
                //$scope.$emit('toast', { message: 'Došlo je do greške, pokusajte kasnije.', type: 'danger' });
        });
    };

    $scope.removeImage = function (image) {
        blogService.removeImage($scope.post.id, image).then(function (res) {
            if (res.success) {
                $scope.post.photos = res.payload.photos;
                $scope.$emit('toast', { message: 'Uspešno obrisano!', type: 'success' });
            }
        });
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});

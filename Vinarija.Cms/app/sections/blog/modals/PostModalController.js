'use strict';
app.controller('PostModalController', function ($scope, $mdDialog, blogService, post, FileUploader, config, localStorageService, taOptions) {
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
        var confirm = $mdDialog.confirm()
       .title('Brisanje slie')
       .textContent('Da li ste sigurni da želite da obrišete sliku?')
       .ariaLabel('Brisanje')
       .targetEvent(ev)
       .ok('Da')
       .cancel('Ne');
        $mdDialog.show(confirm).then(function () {
            blogService.removeImage($scope.post.id, image).then(function (res) {
                $scope.post.postImages = [];
                $scope.$emit('toast', { message: 'Slika uspešno obrisana!', type: 'success' });
            });
        });
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});

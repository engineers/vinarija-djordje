'use strict';
app.controller('TranslateModalController', function ($scope, $mdDialog, blogService, post, FileUploader, config, localStorageService, taOptions) {
    $scope.post = post;

    $scope.translate = function () {
        blogService.translate({ id: post.id, title: post.englishTitle, content: post.englishContent }).then(function (r) {
            $scope.response = r;
            $scope.$emit('toast', { message: 'Uspešno sačuvano!', type: 'success' });
            $mdDialog.hide($scope.response);
        });
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});

'use strict';
app.controller('ImagePreviewModalController', function ($scope, $mdDialog, config, image, $timeout) {
    $scope.image = image;

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});

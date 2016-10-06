'use strict';
app.controller('ImagePreviewModalController', function ($scope, $mdDialog, config, image, $timeout) {
    $scope.image = image;
    console.log($scope.image);

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});

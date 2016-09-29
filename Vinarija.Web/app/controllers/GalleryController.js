app.controller('GalleryController', function ($scope, config, gallery) {
    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;
});
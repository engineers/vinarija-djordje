app.controller('ActualitiesController', function ($scope) {
   
    $scope.newsPopUp = false;

    $scope.showNewsPopUp = function () {
        $scope.newsPopUp = !$scope.newsPopUp;
    };
});
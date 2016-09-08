app.controller('WinesController', function ($scope) {

    $scope.hamburgerMenu = false;

    $scope.showMenu = function () {
        $scope.hamburgerMenu = !$scope.hamburgerMenu;
    };
});
app.controller('LayoutController', function ($scope, contactService) {
    $scope.date = new Date();
    $scope.message = {};

    $scope.contact = function () {
        $scope.loader = true;
        $scope.contactMessage = '';

        contactService.send($scope.message).then(function () {
            $scope.loader = false;
            $scope.contactMessage = 'Thank you. We will contact you shortly.';
        },
        function () {
            $scope.contactMessage = 'Something went wrong, please try again.';
        });
    };

    $scope.hamburgerMenu = false;

    $scope.showMenu = function () {
        $scope.hamburgerMenu = !$scope.hamburgerMenu;
    };
});
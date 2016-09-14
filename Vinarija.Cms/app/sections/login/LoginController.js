app.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'app/sections/login/login.html'
    });
})
.controller('LoginController', function ($scope, $state, adminService, localStorageService) {
    $scope.user = {};

    $scope.login = function () {
        adminService.login($scope.user).then(function (response) {
            localStorageService.set('token', response.token);
            $state.go('layout.hotspot');
        });
    };
});

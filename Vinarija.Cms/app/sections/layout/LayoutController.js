app.config(function ($stateProvider) {
    $stateProvider.state('layout', {
        controller: 'LayoutController',
        templateUrl: 'app/sections/layout/layout.html',
        data: {
            requiresLogin: true
        }
    });
})
.controller('LayoutController', function ($rootScope, $scope, $http, $state, $mdSidenav, localStorageService) {
    $scope.close = function () {
        $mdSidenav('left').close();
    };

    $scope.toggle = function () {
        $mdSidenav('left').toggle();
    };

    $scope.logout = function () {
        localStorageService.remove('token');
        delete $http.defaults.headers.common.access_token;
        $rootScope.session = {};
        $state.go('login');
    };
});

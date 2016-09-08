app.controller('VisitWineryController', function ($scope) {

    $scope.map = {
        center: {
            latitude: 39.8282,
            longitude: -98.5795
        },
        zoom: 10
    };

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 39.8282,
            longitude: -98.5795
        },
        options: {
            icon: '/assets/images/map-marker.png'
        }
    };

    $scope.options = {};
});
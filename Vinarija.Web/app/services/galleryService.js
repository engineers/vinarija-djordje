app.factory('galleryService', function ($http, $q, config) {
    var factory = {};

    factory.getImages = function (params) {
        return $http({
            url: config.baseAddress + 'gallery/getAll',
            method: 'GET',
            params: params
        }).then(function (res) {
            return res.data;
        }, function (err) {
            throw err.message;
        });
    };

    return factory;
});
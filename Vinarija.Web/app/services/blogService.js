app.factory('blogService', function ($http, $q, config) {
    var factory = {};

    factory.getPosts = function (params) {
        return $http({
            url: config.baseAddress + 'post/getAll',
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
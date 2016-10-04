app.factory('adminService', function ($http, config, $rootScope, $q) {
    var factory = {};

    factory.login = function (params) {
        return $http({
            url: config.baseAddress + 'user/login',
            method: 'POST',
            data: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
            return $q.reject(response);
        });
    };

    return factory;
});

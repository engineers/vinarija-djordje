app.factory('statisticService', function ($http, config) {
    var factory = {};

    factory.getUsers = function (params) {
        return $http({
            url: config.baseAddress + 'statistic/getUsers',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            throw 'statisticService.get: ' + response.data.error;
        });
    };

    factory.getUsersLogs = function (params) {
        return $http({
            url: config.baseAddress + 'statistic/getUsersLogs',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            throw 'statisticService.getUsersLogs: ' + response.data.error;
        });
    };

    return factory;
});

﻿app.factory('blogService', function ($http, config, $rootScope) {
    var factory = {};

    factory.get = function (params) {
        return $http({
            url: config.baseAddress + 'post/getAll',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.get: ' + response.data.message;
        });
    };

    factory.add = function (data) {
        return $http({
            url: config.baseAddress + 'post/add',
            method: 'POST',
            data: data
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.add: ' + response.data.message;
        });
    };

    factory.update = function (data) {
        return $http({
            url: config.baseAddress + 'post/update',
            method: 'PUT',
            data: data
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.update: ' + response.data.message;
        });
    };

    factory.remove = function (id) {
        return $http({
            url: config.baseAddress + 'post/delete',
            method: 'DELETE',
            params: { _id: id }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.remove: ' + response.data.message;
        });
    };

    factory.removeImage = function (postId, image) {
        return $http({
            url: config.baseAddress + 'post/removeImage',
            method: 'PUT',
            data: { postId: hotspotId, image: image }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message:  response.data.message, type: 'danger' });

            throw 'blogService.remove: ' + response.data.message;
        });
    };

    return factory;
});
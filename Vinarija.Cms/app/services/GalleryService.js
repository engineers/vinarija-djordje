app.factory('galleryService', function ($http, config, $rootScope) {
    var factory = {};

    factory.getImages = function (params) {
        return $http({
            url: config.baseAddress + 'gallery/getAll',
            method: 'GET',
            params: params
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
        });
    };

    factory.removeImage = function (imageId) {
        return $http({
            url: config.baseAddress + 'gallery/removeImage',
            method: 'DELETE',
            params: { imageId: imageId }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
        });
    };

    factory.saveReorder = function (images) {
        var galleryIds = images.map(function (image) {
            return image.id;
        });

        galleryIds.reverse();
        return $http({
            url: config.baseAddress + 'gallery/reorder',
            method: 'PUT',
            data: {
                galleryIds: galleryIds
            }
        })
        .then(function (response) {
            return response.data;
        }, function (response) {
            $rootScope.$emit('toast', { message: response.data.message });
        });
    };

    return factory;
});

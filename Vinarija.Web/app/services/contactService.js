app.factory('contactService', function ($http, $q, config) {
    var factory = {};

    factory.send = function (message) {
        return $http({
            url: config.baseAddress + 'mail/contact',
            method: 'POST',
            headers: { 'Authorization': '5186abe1-71ca-4e21-9a16-02eb749ba8d5' },
            data: message
        });
    };

    return factory;
});
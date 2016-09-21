app.factory('blogService', function ($http, $q, config) {
    var factory = {};

    factory.monthsLocale = {
        'Jan': 'јан',
        'Feb': 'феб',
        'Mar': 'мар',
        'Apr': 'апр',
        'May': 'мај',
        'Jun': 'јун',
        'Jul': 'јул',
        'Avg': 'авг',
        'Sep': 'сеп',
        'Oct': 'окт',
        'Nov': 'нов',
        'Dec': 'дец'
    };

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

    factory.buildPreviewDate = function (posts) {
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].postImages && posts[i].postImages.length) {
                posts[i].imageUrl = config.contentAddress + 'Posts\\' + posts[i].id + '\\' + posts[i].postImages[0].filePath
            }
            posts[i].dateDay =  moment.utc(posts[i].date).local().format("DD");
            posts[i].dateMonth = factory.monthsLocale[moment.utc(posts[i].date).local().format("MMM")];
        }
    }

    return factory;
});
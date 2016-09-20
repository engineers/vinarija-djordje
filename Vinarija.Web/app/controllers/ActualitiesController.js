app.controller('ActualitiesController', function ($scope, blogService, postsData, config) {
    $scope.newsPopUp = false;
    $scope.params = {
        pageNumber: 1,
        pageSize: 2
    };
    $scope.monthsLocale = {
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

    $scope.posts = postsData.posts;
    $scope.totalCount = postsData.totalCount;
    buildPreviewDate();

    $scope.showNewsPopUp = function (post) {
        $scope.newsPopUp = !$scope.newsPopUp;
        if ($scope.newsPopUp) {
            $scope.postPreview = post;
        } else {
            $scope.postPreview = undefined;
        }
        console.log($scope.postPreview);
    };

    $scope.pageChanged = function (page) {
        $scope.params.pageNumber = page;
        getData();
    };

    function getData() {
        blogService.getPosts($scope.params).then(function (reponse) {
            $scope.posts = reponse.posts;
            $scope.totalCount = reponse.totalCount;
            buildPreviewDate()
        });
    }

    function buildPreviewDate() {
        for (var i = 0; i < $scope.posts.length; i++) {
            if ($scope.posts[i].postImages && $scope.posts[i].postImages.length) {
                $scope.posts[i].imageUrl = config.contentAddress + 'Posts\\' + $scope.posts[i].id + '\\' + $scope.posts[i].postImages[0].filePath
            }
            $scope.posts[i].dateDay = moment($scope.posts[i].date).format("DD");
            $scope.posts[i].dateMonth = $scope.monthsLocale[moment($scope.posts[i].date).format("MMM")]
        }
    }
});
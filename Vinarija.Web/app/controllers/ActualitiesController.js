app.controller('ActualitiesController', function ($scope, blogService, postsData, config) {
    $scope.newsPopUp = false;
    $scope.params = {
        pageNumber: 1,
        pageSize: 6,
        orderBy: '-date'
    };
    $scope.monthsLocale = blogService.monthsLocale;

    $scope.posts = postsData.posts;
    $scope.initPosts = angular.copy($scope.posts);
    $scope.totalCount = postsData.totalCount;
    blogService.buildPreviewDate($scope.posts);

    $scope.showNewsPopUp = function (post) {
        $scope.newsPopUp = !$scope.newsPopUp;
        if ($scope.newsPopUp) {
            $scope.postPreview = post;
        } else {
            $scope.postPreview = undefined;
        }
    };

    $scope.pageChanged = function (page) {
        $scope.params.pageNumber = page;
        getData();
    };

    function getData() {
        blogService.getPosts($scope.params).then(function (reponse) {
            $scope.posts = reponse.posts;
            $scope.totalCount = reponse.totalCount;
            blogService.buildPreviewDate($scope.posts);
        });
    }

    $scope.$watch('activeLanguage', function (newValue, oldValue) {
        if (newValue == oldValue) return;
        if ($scope.activeLanguage == 'srb') {
            $scope.posts = $scope.initPosts;
            blogService.buildPreviewDate($scope.posts);
        }
        else {
            translate();

        }
    })

    function translate() {
        _.each($scope.posts, function (post) {
            if (post.englishTitle) post.title = post.englishTitle;
            if (post.englishContent) post.content = post.englishContent;

            for (var key in $scope.monthsLocale) {
                if ($scope.monthsLocale[key] == post.dateMonth) {
                    post.dateMonth = key;
                    break;
                }
            }
        })
    }
});
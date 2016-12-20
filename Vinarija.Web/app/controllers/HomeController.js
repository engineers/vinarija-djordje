app.controller('HomeController', function ($scope, $timeout, postsData, config, gallery, blogService) {
    $scope.posts = postsData.posts;
    $scope.initPosts = angular.copy($scope.posts);
    $scope.totalCount = postsData.totalCount;
    $scope.activeIndex = 0;
    blogService.buildPreviewDate($scope.posts);

    $scope.monthsLocale = blogService.monthsLocale;

    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;

    $scope.selectedPost = $scope.posts.length ? $scope.posts[0] : false;

    $scope.selectPost = function (post, index) {
        $scope.selectedPost = post;
        $scope.activeIndex = index;
    };

    $scope.$watch('activeLanguage', function (newValue, oldValue) {
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
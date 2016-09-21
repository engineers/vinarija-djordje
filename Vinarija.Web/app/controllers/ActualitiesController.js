app.controller('ActualitiesController', function ($scope, blogService, postsData, config) {
    $scope.newsPopUp = false;
    $scope.params = {
        pageNumber: 1,
        pageSize: 6
    };
    $scope.monthsLocale = blogService.monthsLocale;

    $scope.posts = postsData.posts;
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
});
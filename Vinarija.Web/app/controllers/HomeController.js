app.controller('HomeController', function ($scope, $timeout, postsData, config, gallery, blogService) {
    $scope.posts = postsData.posts;
    $scope.totalCount = postsData.totalCount;
    $scope.activeIndex = 0;
    blogService.buildPreviewDate($scope.posts);

    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;

    $scope.selectedPost = $scope.posts.length ? $scope.posts[0] : false;

    $scope.selectPost = function (post, index) {
        $scope.selectedPost = post;
        $scope.activeIndex = index;
    };
});
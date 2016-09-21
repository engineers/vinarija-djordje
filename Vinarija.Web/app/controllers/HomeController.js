app.controller('HomeController', function ($scope, $timeout, postsData, config, gallery, blogService) {
    $scope.posts = postsData.posts;
    $scope.totalCount = postsData.totalCount;
    blogService.buildPreviewDate($scope.posts);

    $scope.contentAddress = config.contentAddress;
    $scope.gallery = gallery;

    $scope.selectedPost = $scope.posts.length ? $scope.posts[0] : false;

    $scope.selectPost = function (post) {
        $scope.selectedPost = post;
    };

    console.log($scope.selectedPost);
});
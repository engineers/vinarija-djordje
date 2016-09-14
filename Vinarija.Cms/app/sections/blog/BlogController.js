app.config(function ($stateProvider) {
    $stateProvider.state('layout.blog', {
        url: '/blog',
        controller: 'BlogController',
        templateUrl: 'app/sections/blog/blog.html',
        data: {
            requiresLogin: true
        }
    });
})
.controller('BlogController', function ($scope, blogService, $timeout, $mdDialog) {
    $scope.params = { pageSize: 10, pageNumber: 1 };
    loadData();

    $scope.onPaginate = function (pageNumber, pageSize) {
        $scope.params.pageNumber = pageNumber;
        $scope.params.pageSize = pageSize;
        loadData();
    };

    $scope.onReorder = function (sort) {
        $scope.params.sort = sort;
        loadData();
    };

    $scope.openModal = function (ev, post) {
        $mdDialog.show({
            controller: 'PostModalController',
            templateUrl: 'app/sections/blog/modals/postModal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            size: 'lg',
            clickOutsideToClose: true,
            locals: {
                post: angular.copy(post)
            }
        })
		.then(function (data) {
		    loadData();
		}, function () {
		});
    };

    $scope.removeModal = function (ev, post) {
        var confirm = $mdDialog.confirm()
		.title('Brisanje posta')
		.textContent('Da li ste sigurni da želite da obrišete post?')
		.ariaLabel('Brisanje')
		.targetEvent(ev)
		.ok('Da')
		.cancel('Ne');
        $mdDialog.show(confirm).then(function () {
            blogService.remove(post.id).then(function (res) {
                $scope.params.pageNumber = 1;
                loadData();
            });
        });
    };

    var filterTextTimeout;
    $scope.search = function () {
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
        filterTextTimeout = $timeout(function () {
            loadData();
        }, 250);
    };

    function loadData() {
        $scope.loading = true;
        $scope.promise = blogService.get($scope.params).then(function (res) {
            $scope.posts = res.posts;
            $scope.totalItems = res.totalCount;
            $scope.loading = false;
        });

        return $scope.promise;
    }
});

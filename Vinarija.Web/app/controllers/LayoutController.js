app.controller('LayoutController', function ($scope, contactService) {
    $scope.date = new Date();
    $scope.message = {};

    $scope.contact = function () {
        $scope.loader = true;
        $scope.contactMessage = '';

        contactService.send($scope.message).then(function () {
            $scope.loader = false;
            $scope.contactMessage = 'Thank you. We will contact you shortly.';
        },
        function () {
            $scope.contactMessage = 'Something went wrong, please try again.';
        });
    };

    $scope.hamburgerMenu = false;

    $scope.showMenu = function () {
        $scope.hamburgerMenu = !$scope.hamburgerMenu;
    };

    $scope.goToSlide = function (slide) {
        var slide = parseInt(slide);
        $('#active-header-img').slick('slickGoTo', slide);
    };

    //$scope.headerAnimation = {
    //    offset: 0,
    //    transitionTime: '1500',
    //    targetOpacity: 1,
    //    transformation: 'fromScale',
    //    translateValue: '50px',
    //    scaleValue: '0.9'
    //};

    $scope.headlineAnimation = {
        offset: 150,
        transitionTime: '1000',
        targetOpacity: 1,
        transformation: 'fromScale',
        translateValue: '50px',
        scaleValue: '0.5'
    };

    $scope.bodyTextAnimation = {
        offset: 150,
        transitionTime: '1000',
        transformation: 'fromBottom',
        translateValue: '50%',
        targetOpacity: 1
    };

    $scope.rightAnimation = {
        offset: 500,
        targetOpacity: 1,
        transitionTime: '500',
        transformation: 'fromRight',
        translateValue: '50px',
    };

    $scope.leftAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '500',
        transformation: 'fromLeft',
        translateValue: '50px',
    };

    //$scope.circle = {
    //    offset: 150,
    //    transitionTime: '500',
    //    transformation: 'fromScale',
    //    scaleValue: '0.7'
    //};

    $scope.fadeInAnimation = {
        offset: 300,
        targetOpacity: 1,
        transitionTime: '1700',
    };
});
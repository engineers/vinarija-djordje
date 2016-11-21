app.controller('LayoutController', function ($scope, contactService, $translate) {
    $scope.homeLoader = true;
    $scope.date = new Date();
    $scope.message = {};

    $scope.dropdownVisible = false;

    $scope.changeLanguage = function (key) {
        $translate.use(key);
        $scope.dropdownVisible = false;

        if (key == 'srb') {
            $scope.activeLanguage = 'srb';
        } else {
            $scope.activeLanguage = 'eng';
        }
    };

    $scope.changeLanguage('srb');

    $scope.showDropdown = function ($event) {
        $scope.dropdownVisible = !$scope.dropdownVisible;
    }

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

    $scope.fadeInAnimation = {
        offset: 280,
        targetOpacity: 1,
        transitionTime: '1700',
    };

    $scope.leftBottleAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '1000',
        transformation: 'fromLeft',
        translateValue: '200px',
    };

    $scope.rightBottleAnimation = {
        offset: 350,
        targetOpacity: 1,
        transitionTime: '1000',
        transformation: 'fromRight',
        translateValue: '200px',
    };

    var imgHome = new Image();
    imgHome.src = '../../../assets/images/slide1.jpg';

    imgHome.onload = function () {
        $scope.homeLoader = false;
        $scope.$apply();
    };
});
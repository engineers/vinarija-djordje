app.directive('scrollToSection', function ($timeout, $compile, $state) {
    return {
        restrict: 'A',
        scope: { sectionToScroll: '@', time: '@', state: '@' },
        link: function (scope, element, attrs) {
            $(element).on("click", function () {

                if ($state.current.name != scope.state) {
                    $state.go(scope.state);
                }

                $timeout(function () {
                    $('html,body').animate({
                        scrollTop: $('.' + scope.sectionToScroll).offset().top
                    }, scope.time);
                }, 100);
            });
        }
    }
});
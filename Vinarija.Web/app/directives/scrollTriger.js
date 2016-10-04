app.directive("scrollTrigger", function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            animationSettings: '=',
            animationDelay: '='
        },
        link: function (scope, element, attrs) {
            if ($(window).width() > 1024) {
                if (scope.animationSettings.targetOpacity) {
                    element.css({
                        'opacity': '0',
                    });
                }
            }
            if ($(window).width() > 1024) {
                switch (scope.animationSettings.transformation) {
                    case 'fromLeft':
                        element.css({
                            'transform': 'translateX(-' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromRight':
                        element.css({
                            'transform': 'translateX(' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromTop':
                        element.css({
                            'transform': 'translateY(-' + scope.animationSettings.translateValue + ')'
                        });
                        break;
                    case 'fromBottom':
                        element.css({
                            'transform': 'translateY(' + scope.animationSettings.translateValue + ')'
                        });
                    case 'fromScale':
                        element.css({
                            'transform': 'scale(' + scope.animationSettings.scaleValue + ')'
                        });
                        break;
                    default:
                }
            }

            var visibility = false;
            if ($(window).width() > 1024) {
                var scrollOffset = scope.animationSettings.offset;
            }

            executeAnimation();
            $($window).bind("scroll", executeAnimation);


            function executeAnimation() {
                var scrollPosition = $(window).scrollTop() + $(window).height() - scrollOffset;
                var elementPosition = element.offset().top;
                if (scrollPosition > elementPosition) {
                    visibility = true;
                }

                if (visibility && scope.animationSettings.transformation) {
                    $timeout(function () {
                        element.css({
                            'opacity': scope.animationSettings.targetOpacity,
                            'transform': 'translateY(0) translateX(0) scale(1)',
                            '-webkit-transition': 'all ' + scope.animationSettings.transitionTime + 'ms',
                            'transition': 'all ' + scope.animationSettings.transitionTime + 'ms'
                        });
                    }, scope.animationDelay);
                }
                else if (visibility) {
                    $timeout(function () {
                        element.css({
                            'opacity': scope.animationSettings.targetOpacity,
                            '-webkit-transition': 'all ' + scope.animationSettings.transitionTime + 'ms',
                            'transition': 'all ' + scope.animationSettings.transitionTime + 'ms'
                        });
                    }, scope.animationDelay);
                }
            }
        }
    };
});


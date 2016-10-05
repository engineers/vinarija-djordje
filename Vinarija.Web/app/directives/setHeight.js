app.directive('setHeight', function () {
    return function (scope, element, attrs) {
        element.height($(window).height());
        var windowWidth = $(window).width();

        $(window).bind('resize', function () {

            if ($(window).width() > 767) {
                element.height($(window).height());
            }
            else {
                if ($(window).width() != windowWidth) {
                    windowWidth = $(window).width();
                    element.height($(window).height());
                }
            };
        });
    }
});
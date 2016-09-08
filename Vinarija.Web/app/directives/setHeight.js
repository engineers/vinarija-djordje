app.directive('setHeight', function () {
    return function (scope, element, attrs) {
        element.height($(window).height());
        $(window).resize(function () {
            element.height($(window).height());
        });
    }
});

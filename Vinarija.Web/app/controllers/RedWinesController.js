app.controller('RedWinesController', function ($scope, $timeout, $state) {

    $(document).ready(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage').fullpage();
    });

    $scope.changeState = function () {
        $state.go('layout.wines');
    };
});
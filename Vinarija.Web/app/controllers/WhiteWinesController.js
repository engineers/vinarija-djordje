app.controller('WhiteWinesController', function ($scope, $timeout, $state) {

    $timeout(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage-white').fullpage();
    });

    $scope.changeState = function () {
        $state.go('layout.wines');
    };

});
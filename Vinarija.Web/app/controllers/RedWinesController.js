app.controller('RedWinesController', function ($scope, $timeout) {

    $(document).ready(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage').fullpage();
    });

});
app.controller('WhiteWinesController', function ($scope, $timeout) {

    $(document).ready(function () {
        if ($('html').hasClass("fp-enabled")) {
            $.fn.fullpage.destroy('all');
        }
        $('#fullpage-white').fullpage();
    });

});
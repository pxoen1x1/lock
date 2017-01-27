(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerInviteController', CustomerInviteController);

    CustomerInviteController.$inject = ['$mdDialog', '$window', 'urlService'];

    /* @ngInject */
    function CustomerInviteController($mdDialog, $window, urlService) {
        var vm = this;

        vm.inviteData = {};

        vm.submit = submit;
        vm.cancel = cancel;

        function submit(inviteData, isFromValid) {
            if (!isFromValid) {

                return;
            }

            var url = urlService.getUrl();

            var mailTo = 'mailto:' + inviteData.email;
            var mailSubject = '?subject=Lockheal';
            var mailBody = '&body=';
            var mailMessage = 'Hi ' + inviteData.name + '.' + '\r\n\r\n' +
                'Have you heard about Lockheal' + '?' + '\r\n\r\n' +
                'Use the link below and check out their website:' + '\r\n' +
                url + '\r\n\r\n' +
                'Enjoy and all the best!';

            mailMessage = encodeURIComponent(mailMessage);


            var link = mailTo + mailSubject + mailBody + mailMessage;

            $window.open(link, '_self');
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
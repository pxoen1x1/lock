(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerInviteController', CustomerInviteController);

    CustomerInviteController.$inject = ['$mdDialog', '$window'];

    /* @ngInject */
    function CustomerInviteController($mdDialog, $window) {
        var vm = this;

        vm.inviteData = {};

        vm.submit = submit;
        vm.cancel = cancel;

        function submit(inviteData, isFromValid) {
            if (!isFromValid) {

                return;
            }
            var link = 'mailto:' + inviteData.email + 
                '?subject=Locksmith&body=Hi ' + inviteData.name +
                ',%0D%0A %0D%0AHave you heard about Locksmith?%0D%0A%0D%0A' +
                'Use the link below and check out their website.%0D%0A%0D%0A' +
                'http://www.locksmith.com%0D%0A%0D%0AEnjoy and all the best!';
            
            $window.open(link, '_self');
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
(function () {
    'use strict';

    var memberInvitationConfig = {
        controller: MemberInvitationController,
        controllerAs: 'vm',
        templateUrl: 'group/components/member-invitation/member-invitation.html',
        replace: 'true',
        bindings: {
            email: '<'
        }
    };

    angular
        .module('app.group')
        .component('memberInvitation', memberInvitationConfig);

    MemberInvitationController.$inject = ['$filter', 'groupDataservice','toastService'];

    function MemberInvitationController($filter, groupDataservice, toastService) {
        var vm = this;

        vm.newMemberEmail = '';

        vm.inviteNewMember = inviteNewMember;

        function inviteMember(email) {

            return groupDataservice.inviteMember(email)
                .then(function () {
                    vm.newMemberEmail = '';
                    toastService.success($filter('translate')('INVITE_WAS_SENT'));
                });
        }

        function inviteNewMember(newMemberEmail, isFormValid) {
            if (!newMemberEmail || !isFormValid) {

                return;
            }

            var email = {
                email: newMemberEmail
            };

            inviteMember(email);
        }
    }
})();
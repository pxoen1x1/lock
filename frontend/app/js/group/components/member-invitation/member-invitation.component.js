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

    MemberInvitationController.$inject = ['groupDataservice'];

    function MemberInvitationController(groupDataservice) {
        var vm = this;

        vm.newMemberEmail = '';

        vm.inviteNewMember = inviteNewMember;

        function inviteMember(email) {

            return groupDataservice.inviteMember(email)
                .then(function () {
                    vm.newMemberEmail = '';
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
(function () {
    'use strict';

    angular
        .module('app.registration')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = [
        '$state',
        'coreConstants',
        'authService',
        'usingLanguageService',
        'routingService'
    ];

    /* @ngInject */
    function CustomerRegistrationController($state, coreConstants, authService, usingLanguageService, routingService) {
        var vm = this;

        vm.user = {};

        vm.showSocialButtons = false;

        vm.loginWithFacebook = loginWithFacebook;
        vm.createUser = createUser;

        activate();

        function login(type) {

            return authService.login(null, type);
        }

        function loginWithFacebook() {
            var loginType = 'facebook';

            login(loginType);
        }

        function createUser(auth, user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            user.usingLanguage = usingLanguageService.getLanguage();
            auth.user = user;

            var params = {
                auth: auth
            };

            return authService.register(params)
                .then(function () {
                    $state.go(coreConstants.USER_TYPE_DEFAULT_STATE[coreConstants.USER_TYPES.CLIENT]);
                });
        }

        function activate() {

            routingService.redirectIfLoggedIn();
        }
    }
})();

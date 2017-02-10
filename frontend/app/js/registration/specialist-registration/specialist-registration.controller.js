(function () {
    'use strict';

    angular
        .module('app.registration')
        .controller('SpecialistRegistrationController', SpecialistRegistrationController);

    SpecialistRegistrationController.$inject = [
        '$state',
        'coreConstants',
        'authService',
        'registrationConstants',
        'usingLanguageService',
        'routingService'
    ];

    /* @ngInject */
    function SpecialistRegistrationController($state, coreConstants, authService,
                                              registrationConstants, usingLanguageService, routingService) {

        var vm = this;

        vm.user = {
            details: {},
            groups: {}
        };
        vm.user.details.carLicensePlateNumber = '';

        vm.auth = {};
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.isAgreeWithAgreement = false;
        vm.isCompanyRegistrationSelected = false;

        vm.datePickerOptions = {
            minDate:  moment()
        };

        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = registrationConstants.SPECIALIST_REGISTRATION_STEPS;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;

        activate();

        function createUser(user) {

            return authService.register(user);
        }

        function goToNextStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep++;
        }

        function goToPrevStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep--;
        }

        function goToStep(indexStep, isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep = indexStep;
        }

        function createNewUser(auth, user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            if (vm.isCompanyRegistrationSelected) {
                delete user.details;
            } else {
                delete user.groups;
            }

            user.usingLanguage = usingLanguageService.getLanguage();
            auth.user = user;

            var params = {
                auth: auth
            };

            createUser(params)
                .then(function () {
                    if (vm.isCompanyRegistrationSelected) {
                        $state.go(coreConstants.USER_TYPE_DEFAULT_STATE[coreConstants.USER_TYPES.GROUP_ADMIN]);
                    } else {
                        $state.go(coreConstants.USER_TYPE_DEFAULT_STATE[coreConstants.USER_TYPES.SPECIALIST]);
                    }
                });
        }

        function activate() {

            routingService.redirectIfLoggedIn();
        }
    }
})();
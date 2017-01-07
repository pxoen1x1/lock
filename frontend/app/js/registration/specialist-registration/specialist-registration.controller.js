(function () {
    'use strict';

    angular
        .module('app.registration')
        .controller('SpecialistRegistrationController', SpecialistRegistrationController);

    SpecialistRegistrationController.$inject = [
        '$q',
        '$state',
        'coreDataservice',
        'coreConstants',
        'coreDictionary',
        'authService',
        'registrationConstants'
    ];

    /* @ngInject */
    function SpecialistRegistrationController($q, $state, coreDataservice, coreConstants, coreDictionary, authService,
                                              registrationConstants) {

        var vm = this;

        vm.user = {
            details: {},
            groups: {}
        };
        vm.auth = {};
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.isAgreeWithAgreement = false;
        vm.isCompanyRegistrationSelected = false;

        vm.datePickerOptions = {
            minDate: new Date()
        };

        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = registrationConstants.SPECIALIST_REGISTRATION_STEPS;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;

        function createUser(user) {

            return authService.register(user)
                .then(function () {

                    $state.go('home');
                });
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
                user.groups.licenses = remoleInvalidLicenses(vm.licenses);

                delete user.details;
            } else {
                user.details.licenses = remoleInvalidLicenses(vm.licenses);

                delete user.groups;
            }

            auth.user = user;

            var params = {
                auth: auth
            };

            createUser(params);
        }
    }
})();
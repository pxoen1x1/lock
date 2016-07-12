(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController)
        .controller('StepperController', StepperController);

    ProviderRegistrationController.$inject = ['$state'];

    /* @ngInject */
    function ProviderRegistrationController($state) {
        var vm = this;
        vm.submit = submit;
        vm.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        vm.states = loadAll();
        vm.serviceTypes = [
            {
                display: "Car",
                value: "car"
            },
            {
                display: "Residential",
                value: "res"
            },
            {
                display: "Commercial",
                value: "com"
            }
        ];
        vm.serviceProcedures = [
            {
                display: "First",
                value: "1"
            },
            {
                display: "Second",
                value: "2"
            },
            {
                display: "Third",
                value: "3"
            }
        ];
        vm.getNumber = getNumber;

        vm.serviceTypeChange = serviceTypeChange;

        function submit() {
            alert(angular.toJson(vm.user));
        }

        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
            Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
            Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
            Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
            North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
            South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
            Wisconsin, Wyoming';

            return allStates.split(/, +/g).map(function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        function getNumber(num) {
            console.log(new Array(num));
            return new Array(num);
        }

        function serviceTypeChange() {
            var valid = false;
            for (var i=0; i<vm.serviceTypes.length; i++) {
                if (vm.user.serviceType[i] == true) valid = true;
            }
            if (!valid) vm.user.serviceType = null;
            return valid;
        }
        
    }

    function StepperController() {
        var vm = this;
        vm.stepperItems = [
            {
                title: "Profile",
                valid: false
            },
            {
                title: "Service",
                valid: false
            },
            {
                title: "Work",
                valid: false
            },
            {
                title: "Payments",
                valid: false
            }
        ];
        vm.templatesPath = "provider/registration/layout/steps/";
        vm.currentStep = 0;

        vm.isStepCurrent = isStepCurrent;
        vm.isStepValid = isStepValid;
        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;
        vm.gotoPreviousStep = gotoPreviousStep;
        vm.gotoNextStep = gotoNextStep;
        vm.gotoStep = gotoStep;

        function isStepCurrent(a) {
            return vm.currentStep == a;
        }

        function isStepValid(a, valid) {
            if (a==vm.currentStep) {
                vm.stepperItems[a].valid = valid;
                return valid;
            }
            return vm.stepperItems[a].valid;
        }

        function isFirstStep() {
            return vm.currentStep == 0;
        }

        function isLastStep() {
            return vm.currentStep == vm.stepperItems.length-1;
        }

        function gotoPreviousStep() {
            vm.currentStep--;
        }

        function gotoNextStep() {
            vm.stepperItems[vm.currentStep].valid = true;
            vm.currentStep++;
        }

        function gotoStep(a) {
            vm.currentStep = a;
        }
    }
})();
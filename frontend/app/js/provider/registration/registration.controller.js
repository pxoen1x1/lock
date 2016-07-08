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

        function submit(data) {
            alert(angular.toJson(data));
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
    }

    function StepperController($scope) {
        var vm = this;
        vm.stepperItems = [
            {
                title: "Profile info",
                valid: true,
                disabled: false
            },
            {
                title: "Service",
                valid: false,
                disabled: true
            },
            {
                title: "Price list",
                valid: false,
                disabled: true
            },
            {
                title: "Bank",
                valid: false,
                disabled: true
            }
        ];
        vm.stepperTemplates = [
            "provider/registration/steps/first.html",
            "provider/registration/steps/second.html",
            "provider/registration/steps/third.html",
            "provider/registration/steps/fourth.html"
        ];
        vm.currentStep = 0;

        vm.isStepCurrent = isStepCurrent;
        vm.isStepValid = isStepValid;
        vm.isStepDisabled = isStepDisabled;
        vm.isFirstStep = isFirstStep;
        vm.gotoPreviousStep = gotoPreviousStep;
        vm.gotoNextStep = gotoNextStep;

        function isStepCurrent(a) {
            if (vm.currentStep == a)
                return true;
            else return false;
        }

        function isStepValid(a) {
            if (vm.stepperItems[a].valid)
                return true;
            else
                return false;
        }

        function isStepDisabled(a) {
            if (vm.stepperItems[a].disabled)
                return true;
            else
                return false;
        }

        function isFirstStep() {
            if (vm.currentStep == 0) return true;
        }

        function gotoPreviousStep() {
            vm.currentStep--;
        }

        function gotoNextStep() {
            vm.currentStep++;
        }
    }
})();
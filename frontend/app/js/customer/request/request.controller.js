(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestController($state) {
        var vm = this;

        vm.states = loadAll();
        vm.languages = ["English", "Spanish", "Russian", "Elven"];
        vm.submit = submit;


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

        function submit() {
            alert(angular.toJson(vm.data));
        }
    }
})();
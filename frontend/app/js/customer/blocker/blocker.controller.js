(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('BlockerDialogController', BlockerDialogController);

    BlockerDialogController.$inject = ['$interval', 'moment'];

    /* @ngInject */
    function BlockerDialogController($interval, moment) {
        var stopCountdown;
        var eventTime;
        var interval = 1000;
        var vm = this;

        vm.diffTime = 0;
        vm.day = '';
        vm.hours = '';
        vm.minutes = '';
        vm.seconds = '';

        activate();

        function startCountdown(diffTime, interval) {
            var duration = moment.duration(diffTime, 'milliseconds');

            return $interval(function () {
                var currentTime = Date.now();

                vm.diffTime = eventTime - currentTime;

                if(vm.diffTime <= 0){
                    $interval.cancel(stopCountdown);
                }

                duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');

                vm.day = moment.duration(duration).days();
                vm.hours = moment.duration(duration).hours();
                vm.minutes = moment.duration(duration).minutes();
                vm.seconds = moment.duration(duration).seconds();
            }, interval);
        }

        function activate() {
            var currentTime = Date.now();

            eventTime = moment('02-28-2017 23:59:59', 'MM-DD-YYYY HH:mm:ss').unix() * 1000;
            vm.diffTime = eventTime - currentTime;

            if (vm.diffTime <= 0) {

                return;
            }

            stopCountdown = startCountdown(vm.diffTime, interval);
        }
    }
})();
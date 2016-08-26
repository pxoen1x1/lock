(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = [];

    /* @ngInject */
    function ProviderProfileController() {
        var vm = this;

        vm.dataSource = {
            id: 1,
            name: 'Tony Stark',
            photo: 'https://s-media-cache-ak0.pinimg.com/736x/38/fd/d2/38fdd224b7674128ae34ed9138fa730f.jpg',
            email: 'tony@stark.org',
            phone: '+1 (123) 456-789-10',
            card: '9000 1234 5678 9142',
            verified: 1,
            rating: 4.5,
            license: {
                number: '1234253432234',
                date: '2016-03-26T10:00:00.000Z'
            },
            workingHours: {
                from: '2016-08-26T10:00:00.000Z',
                to: '2016-08-26T18:00:00.000Z'
            },
            services: [
                {
                    name: 'Car',
                    price: 40
                },
                {
                    name: 'House',
                    price: 60
                }
            ],
            joined: {
                date: '2016-07-15T10:00:00.000Z',
                elapsed: '1 month 14 days'
            },
            requestsDone: {
                total: 16,
                month: 4
            },
            earned: {
                total: 600,
                month: 200
            }
        };

        vm.datePickerOptions = {
            maxDate: new Date()
        };

        vm.isEditing = false;
        vm.updateUser = updateUser;

        function updateUser() {
            vm.isEditing = false;
        }
    }
})();
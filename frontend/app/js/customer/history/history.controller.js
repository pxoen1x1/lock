(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerHistoryController', CustomerHistoryController);
    
    CustomerHistoryController.$inject = ['$state', '$timeout', '$mdMedia'];

    /* @ngInject */
    function CustomerHistoryController($state, $timeout, $mdMedia) {
        var vm = this;

        vm.$mdMedia = $mdMedia;

        vm.dataSource = {
            items: [
                {
                    id: 1,
                    type: 0,
                    date: "15.07.2016",
                    location: "Wall Street, New York City, NY 10005",
                    status: 0,
                    cost: 0
                },
                {
                    id: 2,
                    type: 1,
                    date: "15.07.2016",
                    location: "Wall Street, New York City, NY 10005",
                    status: 2,
                    cost: 300,
                    provider: {
                        id: 123,
                        name: "Alex Neff",
                        rating: 3.2
                    }
                },
                {
                    id: 3,
                    type: 2,
                    date: "05.07.2016",
                    location: "Wall Street, New York City, NY 10005",
                    status: 2,
                    cost: 200,
                    provider: {
                        id: 123,
                        name: "Mark Zuckerberg",
                        rating: 4.5
                    }
                },
                {
                    id: 4,
                    type: 2,
                    date: "04.07.2016",
                    location: "Wall Street, New York City, NY 10005",
                    status: 1,
                    cost: 250,
                    provider: {
                        id: 123,
                        name: "Any Locksmith",
                        rating: 5
                    }
                },
                {
                    id: 5,
                    type: 0,
                    date: "03.07.2016",
                    location: "Wall Street, New York City, NY 10005",
                    status: 0,
                    cost: 0
                }
            ],
            count: 14
        };

        vm.query = {
            order: '-date',
            limit: 10,
            page: 1
        };

        vm.status = ["New", "In progress", "Closed"];
        vm.type = ["Car", "Residental", "Commercial"];

        vm.loadStuff = function () {
        };

        vm.logOrder = function (order) {
        };
    }
})();
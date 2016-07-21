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
        vm.selected = [];

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
                        name: "Richard Hendricks",
                        photo: "http://www.piedpiper.com/app/themes/pied-piper/dist/images/richard.png",
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
                        name: "Erlich Bachman",
                        photo: "http://www.piedpiper.com/app/themes/pied-piper/dist/images/erlich.png",
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
                        name: "Nelson Bighetti",
                        photo: "http://www.piedpiper.com/app/themes/pied-piper/dist/images/bighead.png",
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

        vm.logItem = function(item) {
            $state.go('customer.request.view', {'requestId': item.id});
        };
    }
})();
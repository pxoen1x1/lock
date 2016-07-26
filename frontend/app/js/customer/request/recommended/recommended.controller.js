(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestRecommendedController', CustomerRequestRecommendedController);

    CustomerRequestRecommendedController.$inject = ['$scope', '$state', '$mdMedia'];

    /* @ngInject */
    function CustomerRequestRecommendedController($scope, $state, $mdMedia) {
        var vm = this;

        vm.$mdMedia = $mdMedia;
        vm.showOnlyAvailable = false;
        vm.providers = {
            left : [],
            right : []
        };


        vm.init = function() {
            var _arr = [];
            vm.providers.left = [];
            vm.providers.right = [];

            for (var i = 0; i < 20; i++) _arr.push(getRandProvider());

            // remove not available if needed
            if (vm.showOnlyAvailable) {
                for (var i = _arr.length-1; i >= 0; i--) {
                    if (!_arr[i].available) {
                        _arr.splice(i, 1);
                    }
                }
            }
            var arr = _.sortBy(_arr, "distance");
            var a = [], b = [];
            if (vm.$mdMedia('gt-xs')) {
                for (var i = 0; i < arr.length; i++) {
                    if (i % 2) {
                        vm.providers.right.push(arr[i]);
                    } else {
                        vm.providers.left.push(arr[i]);
                    }
                }
            } else {
                vm.providers.left = vm.providers.left.concat(arr.slice(0, arr.length/2));
                vm.providers.right = vm.providers.right.concat(arr.slice(arr.length/2,arr.length));
            }
        };

        var getRandProvider = function() {
            var _p = ["erlich", "richard", "bighead", "jared", "dinesh", "gilfoyle"];
            var _n = ["Erlich Bachman", "Richard Hendricks", "Nelson Bigetti", "Jared Dunn", "Dinesh Chugtai", "Bertram Gilfoyle"];
            var r = Math.floor(Math.random()*100) % _p.length;
            return {
                id: Math.floor(Math.random()*100) % 100,
                photo: "http://www.piedpiper.com/app/themes/pied-piper/dist/images/"+_p[r]+".png",
                name: _n[r],
                rating: ((Math.random()*100 % 3) +3).toFixed(1),
                available: Math.floor(Math.random()*100) % 2,
                done: Math.floor(Math.random()*100) % 50,
                working: {
                    from: Math.floor(Math.random()*100) % 13 + 1,
                    to: Math.floor(Math.random()*100) % 24 + 1
                },
                distance: (Math.random()*100 % 10).toFixed(1)
            };
        };
        
        vm.init();

    }
})();
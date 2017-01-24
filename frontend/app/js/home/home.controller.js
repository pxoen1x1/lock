(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$scope', 'geocoderService', 'coreDictionary', 'authService', 'customerDataservice', 'chatSocketservice'];

    /* @ngInject */
    function HomeController($state, $scope, geocoderService, coreDictionary, authService, customerDataservice, chatSocketservice) {
        var vm = this;
        vm.request = {
            location: {
                id: 1, // for gmaps correct marker adding
                latitude: null,
                longitude: null,
                address: null,
            },
            distance: 100,
            status: 1,
            forDate: null
        };

        vm.feedbacksDataArray= [
            {
                txt: 'asda sdas das dasd'
            },
            {
                txt: 'qweq weqweqweqwe qwe '
            },
            {
                txt: 'zczxcz zc z cz czxczxcz  zc z'
            }
        ];

        vm.serviceTypes = [];
        vm.newRequest = {};
        vm.specialistId = null;

        vm.createdRequest = null;

        vm.locationAutocompleteSelector = 'gmaps_autocomplete';
        vm.locationAutocomplete = {};
        vm.initAutocomplete = initAutocomplete;
        vm.hireSpecialist = hireSpecialist;
        vm.submit = submit;

        activate();


        function submit(newRequest, isFromValid) {

            if (!isFromValid) {

                return;
            }

            var auth = {};
            var user = {};
            auth.email = newRequest.email;

            user.firstName = newRequest.name;
            user.lastName = newRequest.lastName;
            user.phoneNumber = newRequest.phone;

            auth.user = user;

            var params = {
                auth: auth
            };

            return authService.register(params)
                .then(function (result) {

                    vm.request.serviceType = newRequest.serviceType;
                    vm.request.isPublic = true;
                    delete vm.request.location.id; // fix issue with empty location

                    var params = {
                        request: vm.request
                    };

                    return customerDataservice.createRequest(params);

                })
                .then(function (createdRequest) {


                    vm.createdRequest = createdRequest.request;

                    if (!vm.specialistId) {
                        $state.go('customer.requests.request', {requestId: vm.createdRequest.id});
                    } else {
                        var member = {
                            member: {
                                id: vm.specialistId // pass auth.user of specialist selected on map
                            }
                        };


                        return chatSocketservice.createChat(vm.createdRequest, member)
                            .then(function (createdChat) {

                                $state.go('customer.requests.request.chat', {
                                    requestId: vm.createdRequest.id,
                                    chatId: createdChat.id
                                });

                                return createdChat;
                            });
                    }
                });
        }

        function showRequestOnMap() {


            geocoderService.getCurrentCoordinates()
                .then(function (position) {
                    vm.request.location.latitude = position.latitude;
                    vm.request.location.longitude = position.longitude;

                    return geocoderService.getLocation(position.latitude, position.longitude);
                })
                .then(function (address) {
                    vm.request.location.address = address;

                    return vm.request.location.address;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes;

                    return vm.serviceTypes;
                });
        }

        function initAutocomplete() {
            var locationAutocompleteInput = document.getElementById(vm.locationAutocompleteSelector);

            geocoderService.initLocationAutocomplete(vm.locationAutocompleteSelector)
                .then(function (locationAutocomplete) {
                    vm.locationAutocomplete = locationAutocomplete;

                    vm.locationAutocomplete.addListener('place_changed', function () {

                        var place = vm.locationAutocomplete.getPlace();

                        if (place) {
                            vm.request.location.address = place.formatted_address;
                            vm.request.location.latitude = place.geometry.location.lat();
                            vm.request.location.longitude = place.geometry.location.lng();
                        }

                        locationAutocompleteInput.focus(); // patch, watch doesn't call function without this line
                    });

                    return vm.locationAutocomplete;
                });
        }

        function hireSpecialist(specialist) {

            vm.specialistId = specialist.id;
        }


        function activate() {
            getServiceTypes();
            showRequestOnMap(); // works only in Chrome

        }
    }
})();
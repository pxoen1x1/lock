(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$scope', '$location','$filter', 'geocoderService', 'coreDictionary', 'authService', 'customerDataservice', 'chatSocketservice', '$mdDialog', 'routingService', 'toastService', 'conf'];

    /* @ngInject */
    function HomeController($state, $scope, $location, $filter, geocoderService, coreDictionary, authService, customerDataservice, chatSocketservice, $mdDialog, routingService, toastService, conf) {
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

        vm.mapOptions = {
            scrollwheel: false,
            disableDoubleClickZoom: true
        };

        vm.feedbacksDataArray = [
            {
                txt: 'Just want to thank you for a job well done. Just want to thank you for a job well done.Just want to thank you for a job well done.Just want to thank you for a job well done.Just want to thank you for a job well done.',
                author: 'Michael smith'
            },
            {
                txt: 'Just want to thank you for a job well done.',
                author: 'Michael smith'
            },
            {
                txt: 'Just want to thank you for a job well done.',
                author: 'Michael smith'
            }
        ];
        vm.auth = {};
        vm.auth.user = {};
        vm.serviceTypes = [];
        vm.newRequest = {};
        vm.newRequestForm = {};
        vm.details = {};
        vm.options = {
            country: 'us'
        };
        vm.specialistId = null;
        vm.createdRequest = null;
        vm.videoDialog = null;

        vm.autocompleteOptions = {};

        vm.hireSpecialist = hireSpecialist;
        vm.submit = submit;
        vm.showVideo = showVideo;
        vm.closeVideo = closeVideo;

        activate();


        function getLocation() {
            var location = {};

            if (!vm.details.geometry) {

                return;
            }

            location.id = 1; // for displaying marker on the map
            location.address = vm.details.formatted_address;
            location.latitude = vm.details.geometry.location.lat();
            location.longitude = vm.details.geometry.location.lng();

            return location;
        }

        function submit(newRequest, isFromValid) {

            if (newRequest) {
                toastService.warning('Please wait release to get immediate help');

                return;
            }

            vm.request.location = getLocation();
            if (!vm.request.location) {
                vm.newRequestForm.location.$setValidity('address', false);

                return;
            }

            vm.newRequestForm.location.$setValidity('address', true);

            if (!isFromValid) {

                return;
            }

            var params = {
                auth: vm.auth
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
                        $state.go('customer.requests.request.view', {requestId: vm.createdRequest.id});
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
                                    chat: createdChat
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

        function hireSpecialist(specialist) {

            vm.specialistId = specialist.id;
        }

        function showVideo() {
            vm.videoDialog = $mdDialog.show({
                templateUrl: 'home/video.html',
                fullscreen: true,
                controllerAs: 'vm',
                controller: 'HomeController'
            });
        }

        function closeVideo() {
            $mdDialog.hide(vm.videoDialog, 'finished');
        }

        function activate() {
            routingService.redirectIfLoggedIn();

            getServiceTypes();
            showRequestOnMap(); // works only in Chrome

            if ($location.url() === conf.EMAIL_CONFIRMED_URL) {
                toastService.success($filter('translate')('EMAIL_WAS_CONFIRMED'));
            }

            $scope.$watch('vm.details.formatted_address', function (newLocation, oldLocation) {
                if (newLocation === oldLocation) {

                    return;
                }

                vm.request.location = getLocation();
            });
        }
    }
})();
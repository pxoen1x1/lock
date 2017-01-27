(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupMemberInfoController', GroupMemberInfoController);

    GroupMemberInfoController.$inject = [
        '$state',
        '$stateParams',
        'uiGmapIsReady',
        'conf',
        'coreConstants',
        'groupDataservice',
        'geocoderService',
        'mobileService'
    ];

    /* @ngInject */
    function GroupMemberInfoController($state, $stateParams, uiGmapIsReady, conf, coreConstants, groupDataservice,
                                       geocoderService, mobileService) {
        var memberId = $stateParams.memberId;

        var vm = this;
        vm.member = {};

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.map = {
            center: {
                latitude: null,
                longitude: null
            },
            options: {
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            memberMarker: {
                options: {
                    icon: {
                        url: '/images/map-marker-locksmith.png',
                        scaledSize: {
                            width: 50,
                            height: 50
                        }
                    },
                    visible: false,
                    animation: 2
                }
            },
            zoom: 16,
        };

        vm.removeMember = removeMember;

        activate();

        function getGroupMember() {
            var member = {
                id: memberId
            };

            return groupDataservice.getMember(member)
                .then(function (member) {
                    vm.member = member;

                    return vm.member;
                });
        }

        function getCurrentCoordinates() {

            return geocoderService.getCurrentCoordinates();
        }

        function setMapCenter(coordinates) {
            if (!coordinates || !coordinates.latitude || !coordinates.longitude) {

                return;
            }

            vm.map.center = {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            };
        }

        function removeMember() {
            $state.go('group.members');
        }

        function activate() {
            getGroupMember()
                .then(function () {
                    vm.map.memberMarker.options.visible =
                        !!(vm.member.details && vm.member.details.latitude && vm.member.details.longitude);

                    return uiGmapIsReady.promise(1);
                })
                .then(function () {
                    if (!vm.member.details || !vm.member.details.latitude || !vm.member.details.longitude) {

                        return getCurrentCoordinates();
                    }

                    return vm.member.details;
                })
                .then(setMapCenter);
        }
    }
})();
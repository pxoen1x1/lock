(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupMemberInfoController', GroupMemberInfoController);

    GroupMemberInfoController.$inject = [
        '$q',
        '$stateParams',
        'uiGmapIsReady',
        'coreConstants',
        'conf',
        'groupDataservice',
        'geocoderService'
    ];

    /* @ngInject */
    function GroupMemberInfoController($q, $stateParams, uiGmapIsReady, coreConstants, conf, groupDataservice,
                                       geocoderService) {
        var memberId = $stateParams.memberId;

        var vm = this;
        vm.member = {};

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

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

                return $q.reject();
            }

            return uiGmapIsReady.promise(1)
                .then(function () {
                    vm.map.center = {
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                    };
                });
        }

        function activate() {
            getGroupMember()
                .then(function () {
                    if (!vm.member.details || !vm.member.details.latitude || !vm.member.details.longitude) {

                        return getCurrentCoordinates();
                    }

                    vm.map.memberMarker.options.visible = !!(vm.member.details.latitude && vm.member.details.longitude);

                    return vm.member.details;
                })
                .then(function (coordinates) {

                    setMapCenter(coordinates);
                });
        }
    }
})();
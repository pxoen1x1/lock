(function () {
    'use strict';

    var specialistInfoPanelConfig = {
        controller: SpecialistInfoPanelController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/specialist-info-panel/specialist-info-panel.html',
        replace: true,
        bindings: {
            selectedSpecialist: '=',
            toggleSidenav: '&'
        }
    };

    angular
        .module('app.chat')
        .component('specialistInfoPanel', specialistInfoPanelConfig);

    SpecialistInfoPanelController.$inject = [
        '$scope',
        '$q',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'mobileService',
        'coreDataservice'
    ];

    function SpecialistInfoPanelController($scope, $q, conf, coreConstants, chatSocketservice, mobileService, coreDataservice) {
        var pagination = {
            reviews: {}
        };
        var vm = this;

        vm.reviews = {};

        vm.baseUrl = conf.BASE_URL;
        vm.userType = coreConstants.USER_TYPES;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.loadPrevReviews = loadPrevReviews;
        vm.close = close;

        activate();

        function loadPrevReviews() {
            if (!pagination.reviews[vm.selectedSpecialist.id]) {
                pagination.reviews[vm.selectedSpecialist.id] = {
                    page: 1,
                    totalCount: 0,
                    isAllReviewsLoad: false
                };
            }

            if (pagination.reviews[vm.selectedSpecialist.id].isAllReviewsLoad) {

                return $q.reject;
            }

            var params = {
                limit: coreConstants.PAGINATION_OPTIONS.limit,
                page: pagination.reviews[vm.selectedSpecialist.id].page
            };

            return chatSocketservice.getReviews(vm.selectedSpecialist, params)
                .then(function (reviews) {
                    if (!angular.isArray(vm.reviews[vm.selectedSpecialist.id])) {
                        vm.reviews[vm.selectedSpecialist.id] = [];
                    }

                    vm.reviews[vm.selectedSpecialist.id] =
                        vm.reviews[vm.selectedSpecialist.id].concat(reviews.items);

                    pagination.reviews[vm.selectedSpecialist.id].isAllReviewsLoad = reviews.totalCount <=
                        pagination.reviews[vm.selectedSpecialist.id].page * coreConstants.PAGINATION_OPTIONS.limit;
                    pagination.reviews[vm.selectedSpecialist.id].totalCount = reviews.totalCount;

                    pagination.reviews[vm.selectedSpecialist.id].page++;

                    return vm.reviews[vm.selectedSpecialist.id];
                });
        }

        function close() {
            vm.toggleSidenav({navID: 'right-sidenav'});
        }

        function activate() {
            $scope.$watch('vm.selectedSpecialist.id', function (newSelectedSpecialistId, oldSelectedSpecialistId) {
                if (!newSelectedSpecialistId || newSelectedSpecialistId === oldSelectedSpecialistId) {

                    return;
                }

                if (!vm.reviews[newSelectedSpecialistId]) {
                    loadPrevReviews();
                }
            });
        }
    }
})();
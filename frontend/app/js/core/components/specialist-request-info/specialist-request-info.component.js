(function () {
    'use strict';

    var specialistRequestInfoConfig = {
        controller: SpecialistRequestInfoController,
        controllerAs: 'vm',
        templateUrl: 'core/components/specialist-request-info/specialist-request-info.html',
        replaced: true,
        bindings: {
            requestId: '<',
            mapOptions: '<?'
        }
    };

    angular
        .module('app.core')
        .component('specialistRequestInfo', specialistRequestInfoConfig);

    SpecialistRequestInfoController.$inject = [
        'coreConstants',
        'serviceProviderDataservice',
        'currentRequestService',
        'conf'
    ];

    function SpecialistRequestInfoController(coreConstants, serviceProviderDataservice, currentRequestService, conf) {
        var promises = {
            getRequest: null
        };
        var mapOptionsDefault = {
            zoom: 14,
            scrollwheel: false,
            streetViewControl: false,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: false,
            disableDoubleClickZoom: true
        };

        var vm = this;

        vm.request = {};

        vm.mapOptions = vm.mapOptions || mapOptionsDefault;

        vm.baseUrl = conf.BASE_URL;
        vm.dateFormat = coreConstants.DATE_FORMAT;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        activate();

        function getRequestById(request) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            promises.getRequest = serviceProviderDataservice.getRequest(request);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var currentRequest = {
                id: vm.requestId
            };

            getRequestById(currentRequest)
                .then(function (request) {
                    vm.request = request;
                    currentRequestService.setRequest(vm.request);

                    return vm.request;
                });
        }

        function activate() {
            getRequest();
        }
    }
})();
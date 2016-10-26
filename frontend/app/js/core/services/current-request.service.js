(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentRequestService', currentRequestService);

    currentRequestService.$inject = ['$q', 'coreConstants', 'coreDataservice', 'currentUserService'];

    /* @ngInject */
    function currentRequestService($q, coreConstants, coreDataservice, currentUserService) {
        var getRequestFromHttpPromise;
        var currentRequest;

        var service = {
            getRequest: getRequest,
            setRequest: setRequest
        };
        return service;

        function getRequest(request) {
            if (!request || !request.id || (currentRequest && currentRequest.id === request.id)) {

                return $q.resolve(currentRequest);
            }

            return getRequestFromHttp(request);
        }

        function setRequest(request) {
            currentRequest = request;
        }

        function getRequestFromHttp(currentRequest) {
            if (getRequestFromHttpPromise) {

                getRequestFromHttpPromise.cancel();
            }

            return currentUserService.getType()
                .then(function (userTypeId) {
                    var userType = coreConstants.USER_TYPES[userTypeId];

                    getRequestFromHttpPromise = coreDataservice.getRequest(userType, currentRequest);

                    return getRequestFromHttpPromise;
                })
                .then(getRequestFromHttpComplete)
                .catch(getRequestFromHttpFailed);
        }

        function getRequestFromHttpComplete(response) {
            currentRequest = response.data.request;

            return currentRequest;
        }

        function getRequestFromHttpFailed(error) {

            return error;
        }
    }
})();
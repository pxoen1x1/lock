(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function coreDataservice($http, request, conf) {
        var service = {
            getCurrentUser: getCurrentUser,
            getUser: getUser,
            getServiceTypes: getServiceTypes,
            getLanguages: getLanguages,
            getStates: getStates,
            getCities: getCities,
            getNewRequests: getNewRequests,
            getAvailabilityInfo: getAvailabilityInfo,
            createUser: createUser,
            login: login,
            logout: logout,
            resetUserPassword: resetUserPassword,
            updateUser: updateUser,
            acceptOffer: acceptOffer,
            updateRequestStatus: updateRequestStatus
        };

        return service;

        function getCurrentUser() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user',
                method: 'GET'
            });
        }

        function getUser(userId) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'users/' + userId,
                method: 'GET'
            });
        }

        function getServiceTypes() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/service-types',
                method: 'GET'
            });
        }

        function getLanguages() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/languages',
                method: 'GET'
            });
        }

        function getStates() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/states',
                method: 'GET'
            });
        }

        function getCities(stateId, params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/states/' + stateId + '/cities',
                method: 'GET',
                params: params
            });
        }

        function getNewRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/new',
                method: 'GET',
                params: params
            });
        }

        function getAvailabilityInfo(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'users',
                method: 'GET',
                params: params
            });
        }

        function createUser(newUser) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user',
                method: 'POST',
                data: newUser
            })
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
            }
        }

        function login(user, type) {
            var loginType = type || 'local';

            return $http({
                url: conf.BASE_URL + '/auth/login?type=' + loginType,
                method: 'POST',
                data: user
            })
                .then(loginComplete);

            function loginComplete(response) {

                return response.data;
            }
        }

        function logout() {

            return $http({
                url: conf.BASE_URL + '/auth/logout',
                method: 'POST'
            })
                .then(logoutComplete);

            function logoutComplete(response) {

                return response.data;
            }
        }

        function resetUserPassword(user) {

            return $http({
                url: conf.BASE_URL + '/auth/password/reset',
                method: 'POST',
                data: user
            })
                .then(resetPasswordCompleted);

            function resetPasswordCompleted(response) {

                return response.data;
            }
        }

        function updateUser(user) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user',
                method: 'PUT',
                data: user
            })
                .then(updateUserComplete);

            function updateUserComplete(response) {

                return response;
            }
        }

        function acceptOffer(requestId, request) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'client/requests/' + requestId,
                method: 'PUT',
                data: request
            })
                .then(acceptOfferCompleted);

            function acceptOfferCompleted(response) {

                return response.data.request;
            }
        }

        function updateRequestStatus(request, status) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'requests/' + request.id + '/status',
                method: 'PUT',
                data: status
            })
                .then(updateRequestStatusCompleted);

            function updateRequestStatusCompleted(response) {

                return response.data.request;
            }
        }
    }
})();
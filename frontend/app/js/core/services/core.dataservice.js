(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function coreDataservice($http, request, conf) {
        var service = {
            getServices: getServices,
            getLanguages: getLanguages,
            getStates: getStates,
            getCities: getCities,
            getRequest: getRequest,
            createUser: createUser,
            loginUser: loginUser,
            resetUserPassword: resetUserPassword,
            updateUser: updateUser
        };

        return service;

        function getServices() {

            return request.httpWithTimeout({
                url: conf.URL + 'lists/services',
                method: 'GET',
                withCredentials: false
            });
        }

        function getLanguages() {

            return request.httpWithTimeout({
                url: conf.URL + 'lists/languages',
                method: 'GET',
                withCredentials: false
            });
        }

        function getStates() {

            return request.httpWithTimeout({
                url: conf.URL + 'lists/states',
                method: 'GET',
                withCredentials: false
            });
        }

        function getCities(stateId, params) {

            return request.httpWithTimeout({
                url: conf.URL + 'lists/states/' + stateId + '/cities',
                method: 'GET',
                params: params,
                withCredentials: false
            });
        }

        function getRequest(selectedRequest) {

            return request.httpWithTimeout({
                url: conf.URL + 'request/' + selectedRequest.id,
                method: 'GET'
            });
        }

        function createUser(newUser) {

            return $http({
                url: conf.URL + 'user',
                method: 'POST',
                data: newUser,
                withCredentials: false
            })
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
            }
        }

        function loginUser(user) {

            return $http({
                url: conf.URL + 'login',
                method: 'POST',
                data: user,
                withCredentials: false
            })
                .then(loginUserComplete);

            function loginUserComplete(response) {

                return response.data;
            }
        }

        function resetUserPassword(user) {

            return $http({
                url: conf.URL + 'user/password/forgot',
                method: 'POST',
                data: user,
                withCredentials: false
            })
                .then(resetPasswordCompleted);

            function resetPasswordCompleted(response) {

                return response.data;
            }
        }

        function updateUser(user) {

            return $http({
                url: conf.URL + 'user/' + user.id,
                method: 'PUT',
                data: user
            })
                .then(updateUserComplete);

            function updateUserComplete(response) {

                return response.data;
            }
        }
    }
})();
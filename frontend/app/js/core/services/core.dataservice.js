(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function coreDataservice($http, request, conf) {
        var service = {
            getUser: getUser,
            getServiceTypes: getServiceTypes,
            getLanguages: getLanguages,
            getStates: getStates,
            getCities: getCities,
            createUser: createUser,
            login: login,
            logout: logout,
            resetUserPassword: resetUserPassword,
            updateUser: updateUser
        };

        return service;

        function getUser() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + 'api/user',
                method: 'GET'
            });
        }

        function getServiceTypes() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + 'api/lists/service-types',
                method: 'GET',
                withCredentials: false
            });
        }

        function getLanguages() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + 'api/lists/languages',
                method: 'GET',
                withCredentials: false
            });
        }

        function getStates() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + 'api/lists/states',
                method: 'GET',
                withCredentials: false
            });
        }

        function getCities(stateId, params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + 'api/lists/states/' + stateId + '/cities',
                method: 'GET',
                params: params,
                withCredentials: false
            });
        }

        function createUser(newUser) {

            return $http({
                url: conf.BASE_URL + 'api/user',
                method: 'POST',
                data: newUser,
                withCredentials: false
            })
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
            }
        }

        function login(user) {

            return $http({
                url: conf.BASE_URL + 'auth/login',
                method: 'POST',
                data: user,
                withCredentials: false
            })
                .then(loginComplete);

            function loginComplete(response) {

                return response.data;
            }
        }

        function logout() {

            return $http({
                url: conf.BASE_URL + 'auth/logout',
                method: 'POST'
            })
                .then(logoutComplete);

            function logoutComplete(response) {

                return response.data;
            }
        }

        function resetUserPassword(user) {

            return $http({
                url: conf.BASE_URL + 'auth/password/reset',
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
                url: conf.BASE_URL + 'api/user/' + user.id,
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
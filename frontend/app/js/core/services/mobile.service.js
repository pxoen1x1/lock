(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('mobileService', mobileService);

    mobileService.$inject = [
        '$q',
        '$window',
        '$state',
        'coreConstants',
        'pushNotificationConstants',
        'localService',
        'coreDataservice',
        'currentUserService'
    ];

    /* @ngInject */
    function mobileService($q, $window, $state, coreConstants, pushNotificationConstants, localService, coreDataservice,
                           currentUserService) {
        var service = {
            isMobileApplication: isMobileApplication,
            getImagePath: getImagePath,
            saveDeviceInfo: saveDeviceInfo,
            initPushNotifications: initPushNotifications
        };

        return service;

        function isMobileApplication() {

            return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        }

        function getImagePath(imagePath) {
            if (!imagePath) {

                return;
            }

            if (isMobileApplication()) {
                var appDir = $window.cordova.file.applicationDirectory;

                imagePath = appDir + 'www' + imagePath;
            }

            return imagePath;
        }

        function saveDeviceInfo(deviceInfo) {
            deviceInfo = deviceInfo || localService.getDeviceInfo();

            if (!deviceInfo || !isMobileApplication()) {

                return $q.reject();
            }

            deviceInfo = {
                device: deviceInfo
            };

            return coreDataservice.saveDeviceInfo(deviceInfo)
                .then(function (savedDeviceInfo) {
                    localService.setDeviceInfo(savedDeviceInfo);

                    return savedDeviceInfo;
                });
        }

        function initPushNotifications() {
            var pushNotification = $window.PushNotification.init(
                {
                    android: pushNotificationConstants.ANDROID,
                    ios: pushNotificationConstants.IOS
                }
            );

            pushNotification.on('registration', function (data) {
                var deviceInfo = {
                    token: data.registrationId,
                    platform: $window.cordova.platformId,
                    uuid: $window.device.uuid
                };

                var existingDeviceInfo = localService.getDeviceInfo();

                if (existingDeviceInfo && existingDeviceInfo.token && existingDeviceInfo.token === deviceInfo.token) {

                    return;
                }

                return saveDeviceInfo(deviceInfo);
            });

            pushNotification.on('notification', function (response) {
                var state = response.additionalData.state;

                if (!response.additionalData.foreground) {

                    goToState(state);
                }
            });
        }

        function goToState(state) {

            return currentUserService.getType()
                .then(function (userTypeId) {
                    var userType = coreConstants.USER_TYPES[userTypeId];

                    switch (state.name) {
                        case 'chat':
                            $state.go(
                                pushNotificationConstants.STATES.CHAT[userType],
                                {requestId: state.request, chatId: state.chat}
                            );

                            break;

                        case 'request':
                            $state.go(pushNotificationConstants.STATES.CHAT[userType], {requestId: state.request});

                            break;
                    }
                });
        }
    }
})();
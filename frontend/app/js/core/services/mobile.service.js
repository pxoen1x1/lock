(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('mobileService', mobileService);

    mobileService.$inject = [
        '$q',
        '$window',
        'pushNotificationConstants',
        'localService',
        'coreDataservice'
    ];

    /* @ngInject */
    function mobileService($q, $window, pushNotificationConstants, localService, coreDataservice) {
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

            pushNotification.on('notification', function(data) {
                pushNotification.finish(function() {
                    localStorage.setItem('PN finish', data);
                });

                localStorage.setItem('PN ON', data);
            });

            pushNotification.on('error', function(error) {
                console.log(error.message);
            });
        }
    }
})();
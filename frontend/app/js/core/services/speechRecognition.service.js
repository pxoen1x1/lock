(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('speechRecognition', speechRecognition);

    speechRecognition.$inject = ['$rootScope', '$q', '$window'];

    /* @ngInject */
    function speechRecognition($rootScope, $q, $window) {
        var recognition;

        var transcript = '';
        var errorMessage = '';
        var ignoreOnend = false;

        var MediaStreamTrack = $window.MediaStreamTrack;
        var SpeechRecognition = $window.SpeechRecognition || $window.webkitSpeechRecognition;
        var language = $window.navigator.userLanguage || $window.navigator.language || 'en-US';

        var service = {
            isReady: isReady,
            start: start,
            stop: stop,
        };

        return service;

        function isReady() {
            if (!SpeechRecognition) {

                return $q.reject('It looks like your browser doesn\'t support speech recognition.');
            }

            return checkMicrophoneSupport()
                .then(function (isMicrophoneSupported) {
                    if (!isMicrophoneSupported.hasMicrophone) {

                        return $q.reject();
                    }

                    if (!isMicrophoneSupported.isWebsiteHasMicrophonePermissions) {

                        return getUserAudioDevice()
                            .catch(function () {
                                return $q.reject('Microphone is blocked.');
                            });
                    }

                    return $q.resolve();
                });
        }

        function getUserAudioDevice() {

            return navigator.mediaDevices.getUserMedia({audio: true})
                .then(function (stream) {
                    try {
                        stream.getAudioTracks().forEach(function (track) {
                            track.stop();
                        });
                    }
                    catch (e) {
                    }
                });
        }

        function checkMicrophoneSupport() {
            var deferred = $q.defer();

            var isMicrophoneSupported = {
                hasMicrophone: false,
                isWebsiteHasMicrophonePermissions: false
            };

            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.enumerateDevices = function (callback) {
                    navigator.mediaDevices.enumerateDevices()
                        .then(callback).catch(callback);
                };
            }

            var canEnumerate = (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) ||
                (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices);


            if (!navigator.enumerateDevices && MediaStreamTrack && MediaStreamTrack.getSources) {
                navigator.enumerateDevices = MediaStreamTrack.getSources.bind(MediaStreamTrack);
            }

            if (!navigator.enumerateDevices && navigator.enumerateDevices) {
                navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
            }

            if (!canEnumerate || !navigator.enumerateDevices) {

                return deferred.resolve(isMicrophoneSupported);
            }

            navigator.enumerateDevices(function (devices) {
                devices.forEach(function (_device) {
                    var device = {};

                    for (var item in _device) {
                        device[item] = _device[item];
                    }

                    if (device.kind === 'audio') {
                        device.kind = 'audioinput';
                    }

                    device.id = device.id || device.deviceId;

                    if (device.kind === 'audioinput') {
                        isMicrophoneSupported.hasMicrophone = true;
                    }

                    if (device.label &&
                        device.kind === 'audioinput' && !isMicrophoneSupported.isWebsiteHasMicrophonePermissions) {

                        isMicrophoneSupported.isWebsiteHasMicrophonePermissions = true;
                    }

                    return deferred.resolve(isMicrophoneSupported);
                });
            });

            return deferred.promise;
        }

        function start() {
            var deferred = $q.defer();

            if (!recognition) {
                recognition = new SpeechRecognition();

                recognition.lang = language;
                recognition.interimResults = true;
            }

            transcript = '';
            ignoreOnend = false;

            recognition.start();

            onResult();

            onError();

            recognition.onend = function () {
                if (ignoreOnend) {

                    return deferred.reject(errorMessage);
                }

                return deferred.resolve(transcript);
            };

            return deferred.promise;
        }

        function stop() {
            if (!recognition) {

                return;
            }

            recognition.stop();
        }

        function onResult() {
            recognition.onresult = function (event) {
                var interim_transcript = '';
                var final_transcript = '';

                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }

                transcript = final_transcript || interim_transcript;
                transcript = capitalize(transcript);
            };
        }

        function onError() {
            recognition.onerror = function (event) {
                if (event.error === 'no-speech') {
                    errorMessage = 'info_no_speech';
                }
                if (event.error === 'audio-capture') {
                    errorMessage = 'info_no_microphone';
                }
                if (event.error === 'not-allowed') {
                    errorMessage = 'info_blocked';
                }

                ignoreOnend = true;
            };
        }


        function capitalize(string) {

            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
    }
})();


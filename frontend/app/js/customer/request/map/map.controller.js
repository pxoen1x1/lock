(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$scope', '$state', 'uiGmapIsReady', '$timeout'];

    /* @ngInject */
    function CustomerRequestMapController($scope, $state, uiGmapIsReady, $timeout) {
        var vm = this;

        vm.markers = [];
        vm.selectedProvider = '';
        vm.showWindow = false;
        vm.showOnlyAvailable = false;
        vm.createMarker = createMarker;
        vm.getCurrentLocation = getCurrentLocation;

        vm.map = {
            inst: '',
            center: {
                latitude: 53.904398882680574,
                longitude: 27.587450514874202
            },
            zoom: 16,
            options: {
                scrollwheel: false,
                streetViewControl: false
            },
            events: {
                click: function (map, eventName, originalEventArgs) {
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(), lon = e.latLng.lng();
                    var marker = vm.createMarker({
                        id: Date.now(),
                        coords: {
                            latitude: lat,
                            longitude: lon
                        },
                        provider: getRandProvider()
                    });
                    marker.options.data.provider.distance = (getDistance(lat, lon, vm.map.center.latitude, vm.map.center.longitude) / 1000).toFixed(1);

                    vm.markers.push(marker);
                    $scope.$apply();
                }
            }
        };

        function getCurrentLocation() {
            var options = {
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    vm.map.center = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    };
                    console.log('Current location: ' + angular.toJson(vm.map.center));
                    $scope.$apply();
                },
                function (error) {
                    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                },
                options
            );
        }


        function createMarker(data) {
            return {
                id: data.id,
                location: data.coords,
                options: {
                    icon: {
                        url: "/images/map-marker-locksmith" + (!data.provider.available ? "-inactive" : "") + ".png",
                        scaledSize: {
                            width: 50,
                            height: 50
                        }
                    },
                    title: "Locksmith #" + data.id,
                    animation: google.maps.Animation.DROP,
                    data: {
                        provider: data.provider
                    }
                },
                events: {
                    click: function (marker, eventName, model) {
                        var provider = this.options.data.provider;
                        vm.showWindow = false;

                        $timeout(function () {
                            vm.selectedProvider = provider;
                            vm.showWindow = true;
                        }, 200);
                    }
                }
            }
        }

        uiGmapIsReady.promise()
            .then(function (instances) {
                vm.map.inst = instances[0].map;

                vm.markers.push({
                    id: 0,
                    location: vm.map.center,
                    options: {
                        icon: {
                            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAF96VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAABo3uNKT81LLcpMVigoyk/LzEnlUgADYxMuE0sTS6NEAwMDCwMIMDQwMDYEkkZAtjlUKNEABZgamFmaGZsZmgMxiM8FAEi2FMnxHlGkAAADqElEQVRo3t1aTWgTQRQOiuDPQfHs38GDogc1BwVtQxM9xIMexIN4EWw9iAehuQdq0zb+IYhglFovClXQU+uhIuqh3hQll3iwpyjG38Zkt5uffc4XnHaSbpLZ3dnEZOBB2H3z3jeZN+9vx+fzYPgTtCoQpdVHrtA6EH7jme+/HFFawQBu6BnWNwdGjB2BWH5P32jeb0V4B54KL5uDuW3D7Y/S2uCwvrUR4GaEuZABWS0FHhhd2O4UdN3FMJneLoRtN7Y+GMvvUw2eE2RDh3LTOnCd1vQN5XZ5BXwZMV3QqQT84TFa3zuU39sy8P8IOqHb3T8fpY1emoyMSQGDI/Bwc+0ELy6i4nLtepp2mE0jc5L3UAhMsdxut0rPJfRDN2eMY1enF8Inbmj7XbtZhunkI1rZFD/cmFMlr1PFi1/nzSdGkT5RzcAzvAOPU/kVF9s0ujqw+9mP5QgDmCbJAV7McXIeGpqS3Qg7OVs4lTfMD1Yg9QLR518mZbImFcvWC8FcyLAbsev++3YETb0tn2XAvouAvjGwd14YdCahUTCWW6QQIzzDO/CIAzKm3pf77ei23AUkVbICHr8pnDZNynMQJfYPT7wyKBzPVQG3IvCAtyTsCmRBprQpMawWnkc+q2Rbn+TK/+gmRR7qTYHXEuZkdVM0p6SdLLYqX0LItnFgBxe3v0R04b5mGzwnzIUMPiBbFkdVmhGIa5tkJ4reZvyl4Rg8p3tMBh+FEqUduVRUSTKTnieL58UDG76cc70AyMgIBxs6pMyIYV5agKT9f/ltTnJFOIhuwXOCLD6gQ/oc8AJcdtuYb09xRQN3NWULgCwhfqSk3SkaBZViRTK3EYNUSBF4Hic0Y8mM+if0HhlMlaIHbQ8Z5lszxnGuIP2zrAw8J8jkA7pkMAG79AKuPTOOcgWZeVP5AsSDjAxWegGyJoSUWAj/FBpRa0JiviSbfldMqOMPcce7UVeBLK4gkMVVBLI2phLjKlIJm8lcxMNkLuIomXOTTmc1kwYf2E+nMQdzlaTTKgoaZJWyBQ141RY0DkrK6XflAQbih1geZnhJeXu5WeEZ3mVqSkrIgCzXJaXqoh65TUuLerdtFXgQ2bYKeD1pq6hobLE86SlztXMWvaA5vPO0sYWB9p2K1iJS4ra0Fju/udsN7fWu+MDRFZ+YuuIjX1d8Zu2OD92WC9G3ub1qABktBV7vssfBMX1L7yVjZ7PLHuABb9svezS7boNDyK/b4LdX123+Au+jOmNxrkG0AAAAAElFTkSuQmCC",
                            scaledSize: {
                                width: 30,
                                height: 30
                            }
                        },
                        title: "Your request"
                    }
                });
            });

        function getDistance(lat1, lon1, lat2, lon2) {
            var R = 6371e3; // metres
            var φ1 = toRadians(lat1);
            var φ2 = toRadians(lat2);
            var Δφ = toRadians(lat2 - lat1);
            var Δλ = toRadians(lon2 - lon1);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            function toRadians(deg) {
                return deg * (Math.PI / 180)
            }

            return d;
        }

        $scope.$watch('vm.showOnlyAvailable', function (value) {
            if (vm.markers.length === 1) return;
            for (var i = 1; i < vm.markers.length; i++) {
                if (!vm.markers[i].options.data.provider.available) vm.markers[i].options.visible = !value;
            }
        });

        // for testing (remove before production)
        var getRandProvider = function () {
            var _p = ["erlich", "richard", "bighead", "jared", "dinesh", "gilfoyle"];
            var _n = ["Erlich Bachman", "Richard Hendricks", "Nelson Bigetti", "Jared Dunn", "Dinesh Chugtai", "Bertram Gilfoyle"];
            var r = Math.floor(Math.random() * 100) % _p.length;
            return {
                id: Math.floor(Math.random() * 100) % 100,
                photo: "http://www.piedpiper.com/app/themes/pied-piper/dist/images/" + _p[r] + ".png",
                name: _n[r],
                rating: ((Math.random() * 100 % 3) + 3).toFixed(1),
                available: Math.floor(Math.random() * 100) % 2,
                done: Math.floor(Math.random() * 100) % 50,
                working: {
                    from: Math.floor(Math.random() * 100) % 13 + 1,
                    to: Math.floor(Math.random() * 100) % 24 + 1
                },
                distance: 0
            };
        };
    }
})();
(function () {
    'use strict';

    angular.module('app.core')
        .constant('coreConstants', {
            MD_PICKERS_OPTIONS: {
                timePicker: {
                    autoSwitch: true
                }
            },
            PAGINATION_OPTIONS: {
                limit: 10,
                limitOptions: [5, 10, 20]
            },
            CHAT_PAGINATION_OPTIONS: {
                limit: 50
            },
            DATE_FORMAT: 'MMM/dd/yyyy hh:mm a',
            DEFAULT_LANGUAGE: {
                name: 'English',
                code: 'en'
            },
            USER_TYPES: {
                'CLIENT': 1,
                'SPECIALIST': 2,
                'GROUP_ADMIN': 3,
                'ADMIN': 4,
                1: 'client',
                2: 'specialist',
                3: 'groupAdmin',
                4: 'admin'
            },
            USER_TYPE_DEFAULT_STATE: {
                1: 'customer.newRequest',
                2: 'provider.dashboard.new',
                3: 'group.dashboard.new',
                4: 'admin.dashboard'
            },
            REQUEST_STATUSES: {
                1: 'NEW',
                2: 'PENDING',
                3: 'IN_PROGRESS',
                4: 'DONE',
                5: 'CLOSED',
                'NEW': 1,
                'PENDING': 2,
                'IN_PROGRESS': 3,
                'DONE': 4,
                'CLOSED': 5
            },
            IMAGES: {
                'requestLocationMarker': '/images/map-marker-request.png',
                'currentLocationMarker': '/images/map-marker-current.png',
                'locksmithLocationMarker': '/images/map-marker-locksmith.png',
                'defaultPortrait': '/images/default-portrait.png'
            },
            DISTANCE: {
                maxSearchDistance: 100, //mile
                earthRadius: 6371, //km
                toMile: 0.62137
            },
            FILE_UPLOADER_OPTIONS: {
                allowedFileExtensions: {
                    documents: 'txt doc docx jpg jpeg png pdf odt ods odp csv xls xlsx',
                    images: 'jpg jpeg png gif'
                },
                maxFileSize: 2000000
            }
        });
})();
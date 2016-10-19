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
            USER_TYPES: {
                'CLIENT': 1,
                'SPECIALIST': 2,
                1: 'client',
                2: 'specialist'
            },
            USER_TYPE_DEFAULT_STATE: {
                1: 'customer.newRequest',
                2: 'provider.dashboard'
            },
            REQUEST_STATUSES: {
                1: 'new',
                2: 'pending',
                3: 'in progress',
                4: 'done',
                5: 'closed',
                'NEW': 1,
                'PENDING': 2,
                'IN_PROGRESS': 3,
                'DONE': 4,
                'CLOSED': 5
            },
            IMAGES: {
                'requestLocationMarker': '/images/map-marker-current.png',
                'locksmithLocationMarker': '/images/map-marker-locksmith.png',
                'defaultPortrait': '/images/default-portrait.jpg'
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
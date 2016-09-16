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
            DATE_FORMAT: 'MM/DD/YYYY',
            REQUEST_STATUSES: {
                1: 'new',
                2: 'in progress',
                3: 'closed'
            },
            IMAGES: {
                'currentLocationMarker': '/images/map-marker-current.png',
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
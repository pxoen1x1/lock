(function () {
    'use strict';

    angular.module('app.core')
        .constant('coreConstants',{
            MD_PICKERS_OPTIONS:{
                timePicker: {
                    autoSwitch: true
                }
            },
            PAGINATION_OPTIONS: {
                limit: 10,
                limitOptions: [5, 10, 20]
            },
            REQUEST_STATUSES: {
                1: 'new',
                2: 'in progress',
                3: 'closed'
            }
        });
})();
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
            }
        });
})();
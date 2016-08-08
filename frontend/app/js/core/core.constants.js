(function () {
    'use strict';

    angular.module('app.core')
        .constant('coreConstants',{
            MD_PICKERS_OPTIONS:{
                timePicker: {
                    autoSwitch: true
                }
            }
        });
})();
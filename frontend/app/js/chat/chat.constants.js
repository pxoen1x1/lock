(function () {
    'use strict';

    angular
        .module('app.chat')
        .constant('chatConstants', {
            MESSAGE_TYPES: {
                'MESSAGE': 1,
                'OFFER': 2,
                'AGREEMENT': 3
            }
        });
})();
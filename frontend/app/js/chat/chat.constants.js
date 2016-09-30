(function () {
    'use strict';

    angular
        .module('app.chat')
        .constant('chatConstants', {
            MESSAGE_TYPES: {
                'message': 1,
                'offer': 2,
                'agreement': 3
            }
        });
})();
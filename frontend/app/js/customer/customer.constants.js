(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('customerConstants', {
            MENU_ITEMS: [
                'customer.newRequest',
                'customer.requests',
                'customer.invite',
                'customer.profile'
            ],
            REQUEST_TABBAR_ITEMS: [
                'customer.requests.request.view',
                'customer.requests.request.map',
                'customer.requests.request.chat',
                'customer.requests.request.recommended'
            ]
        });

})();
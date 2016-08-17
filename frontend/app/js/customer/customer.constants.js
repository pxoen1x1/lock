(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('customerConstants', {
            MENU_ITEMS: [
                'customer.request.new',
                'customer.request.history',
                'customer.settings'
            ],
            REQUEST_TABBAR_ITEMS: [
                'customer.request.id.view',
                'customer.request.id.map',
                'customer.request.id.chat',
                'customer.request.id.recommended'
            ]
        });

})();
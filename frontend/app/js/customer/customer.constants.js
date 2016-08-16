(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('customerConstants', {
            MENU_ITEMS: [
                'customer.request.new',
                'customer.history',
                'customer.settings'
            ]
        });

})();
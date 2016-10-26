(function () {
    'use strict';

    angular
        .module('app.admin')
        .constant('adminConstants',{
            MENU_ITEMS: [
                'admin.users'
            ],
            USERS_TABBAR_ITEMS: [
                'admin.users.clients',
                'admin.users.providers'
            ]
        });
})();
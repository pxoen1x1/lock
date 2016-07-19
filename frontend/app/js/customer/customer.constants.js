(function () {
    'use strict';

    angular
        .module('app.core')
    .constant('menuItems', [
        {
            display: 'New request',
            icon: 'playlist_add',
            href: '/client/request/new',
            name: 'customer.request.new'
        },
        {
            display: 'History',
            icon: 'history',
            href: '/client/history',
            name: 'customer.history'
        },
        {
            display: 'Settings',
            icon: 'settings',
            href: '/client/settings',
            name: 'customer.settings'
        }
    ]);
    
})();
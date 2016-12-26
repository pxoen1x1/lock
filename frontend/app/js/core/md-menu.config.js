'use strict';
angular
  .module('app.core', ['ngMaterial'])
  .config(mdMenuConfig)

mdMenuConfig.$inject = ['$mdDialog'];
  
  /* @ngInject */
  function DemoCtrl($mdDialog) {
    var originatorEv;

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  });
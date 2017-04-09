(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('appTypeFormCtrl', appTypeFormCtrl);

  appTypeFormCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'data', 'AppType'];

  function appTypeFormCtrl($scope, $rootScope, $mdDialog, data, AppType) {

    // 1. Same form is used for edit and add
    // on edit we get the industry from data object passed from industrie ctrl
    var vm = this;
    vm.appType = data.appType || {}; // [1]
    vm.rating = 0;


    vm.add = add;
    vm.clear = clear;
    vm.close = close;


    function add() {
      if (vm.appType.id) {
        AppType.update(vm.appType).then((data) => {
          $rootScope.$emit('event:appTypeUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        AppType.save(vm.appType).then((data) => {
          $rootScope.$emit('event:appTypeAdd', data);
          vm.appType = {};
        });
      }
    }

    function clear() {
      vm.appType = {};
    }

    function close() {
      $mdDialog.cancel();
    }

  }

})();

(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('customerFormCtrl', customerFormCtrl);

  customerFormCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'data', 'Customer'];

  function customerFormCtrl($scope, $rootScope, $mdDialog, data, Customer) {

    // 1. Same form is used for edit and add
    // on edit we get the customer from data object passed from customers ctrl
    var vm = this;
    vm.customer = data.customer || {}; // [1]
    vm.rating = 0;


    vm.add = add;
    vm.clear = clear;
    vm.close = close;


    function add() {
      if (vm.customer.id) {
        Customer.update(vm.customer).then((data) => {
          $rootScope.$emit('event:customerUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        Customer.save(vm.customer).then((data) => {
          $rootScope.$emit('event:customerAdd', data);
          vm.customer = {};
        });
      }
    }

    function clear() {
      vm.customer = {};
    }

    function close() {
      $mdDialog.cancel();
    }

  }

})();

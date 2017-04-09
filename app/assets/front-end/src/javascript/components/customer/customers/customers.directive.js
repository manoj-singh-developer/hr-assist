(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraCustomers', hraCustomers);

  function hraCustomers() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'customersCtrl',
      controllerAs: 'customers',
      templateUrl: rootTemplatePath + '/customer/customers/customers.view.html'
    };

    return directive;
  }

})();

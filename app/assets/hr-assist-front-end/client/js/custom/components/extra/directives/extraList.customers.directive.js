(function() {

  'use strict';



  // hraExtraListCustomers directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraExtraListCustomers', hraExtraListCustomers);

  function hraExtraListCustomers() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        extra: '='
      },
      controller: 'extraListController',
      controllerAs: 'extraList',
      templateUrl: rootTemplatePath + '/components/extra/views/extraList.customers.view.html'
    };
  }

}());

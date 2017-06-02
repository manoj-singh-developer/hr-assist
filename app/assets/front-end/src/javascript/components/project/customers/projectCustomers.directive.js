(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectCustomers', hraProjectCustomers);

  function hraProjectCustomers() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectCustomersCtrl',
      controllerAs: 'prjCustomers',
      templateUrl: rootTemplatePath + 'project/customers/projectCustomers.view.html',
    };
  }

}());

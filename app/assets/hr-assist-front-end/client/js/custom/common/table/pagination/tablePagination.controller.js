((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('tablePaginationCtrl', tablePaginationCtrl);

  tablePaginationCtrl
    .$inject = ['tableSettings'];

  function tablePaginationCtrl(tableSetting) {
    var vm = this;
    vm.tableSettings = tableSetting;
  }

})(_);

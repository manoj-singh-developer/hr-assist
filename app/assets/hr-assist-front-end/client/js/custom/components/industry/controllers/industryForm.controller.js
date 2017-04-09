(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('industryFormCtrl', industryFormCtrl);

  industryFormCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'data', 'Industry'];

  function industryFormCtrl($scope, $rootScope, $mdDialog, data, Industry) {

    // 1. Same form is used for edit and add
    // on edit we get the industry from data object passed from industrie ctrl
    var vm = this;
    vm.industry = data.industry || {}; // [1]
    vm.rating = 0;


    vm.add = add;
    vm.clear = clear;
    vm.close = close;


    function add() {
      if (vm.industry.id) {
        Industry.update(vm.industry).then((data) => {
          $rootScope.$emit('event:industryUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        Industry.save(vm.industry).then((data) => {
          $rootScope.$emit('event:industryAdd', data);
          vm.industry = {};
        });
      }
    }

    function clear() {
      vm.industry = {};
    }

    function close() {
      $mdDialog.cancel();
    }

  }

})();

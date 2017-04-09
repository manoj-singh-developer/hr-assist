(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('technologyFormCtrl', technologyFormCtrl);

  technologyFormCtrl
    .$inject = ['$scope', 'Technology', '$mdToast', '$mdDialog', '$rootScope', 'technology'];

  function technologyFormCtrl($scope, Technology, $mdToast, $mdDialog, $rootScope, technology) {

    var vm = this;
    vm.technology = technology || {};


    vm.add = add;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;


    function add() {
      if (vm.technology.id) {
        Technology.update(vm.technology).then((data) => {
          $rootScope.$emit('event:technologyUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        Technology.save(vm.technology).then((data) => {
          $rootScope.$emit('event:technologyAdd', data);
          $mdDialog.cancel();
        });
      }
    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.technology = {};
    }

  }

})();

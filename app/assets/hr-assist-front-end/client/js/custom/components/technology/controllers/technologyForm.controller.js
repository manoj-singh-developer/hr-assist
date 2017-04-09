(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('technologyFormCtrl', technologyFormCtrl);

  technologyFormCtrl
    .$inject = ['$scope', 'Technology', '$mdToast', '$mdDialog', '$rootScope', 'technology'];

  function technologyFormCtrl($scope, Technology, $mdToast, $mdDialog, $rootScope, technology) {

    var vm = this;
    vm.skill = technology || {};


    /* beautify preserve:start */
    vm.add         = add;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    /* beautify preserve:end */


    function add() {
      if (vm.skill.id) {
        Technology.update(vm.skill).then(
          function(res) {
            $rootScope.$emit('upSkill', res);
            $mdDialog.cancel();
          });
      } else {
        Technology.save(vm.skill).then(
          function(res) {
            $rootScope.$emit('newSkill', res);
            $mdDialog.cancel();
          });
      }
    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.skill = {};
    }

  }

})();

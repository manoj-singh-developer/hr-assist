(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('deviceFormJsonCtrl', deviceFormJsonCtrl);

  deviceFormJsonCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'Device'];

  function deviceFormJsonCtrl($scope, $rootScope, $mdDialog, Device) {

    var vm = this;
    vm.json = null;


    vm.save = save;
    vm.clear = clear;
    vm.close = close;


    function save(data) {
      var json = angular.fromJson(data);

      Device.saveJson(json).then(function(data) {
        $mdDialog.cancel();
        $rootScope.$emit('addlist', data);
      });
    }

    function clear() {
      vm.json = '';
    }

    function close() {
      $mdDialog.cancel();
    }

  }

})();

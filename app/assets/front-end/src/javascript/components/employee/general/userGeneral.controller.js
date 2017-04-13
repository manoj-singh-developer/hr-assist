(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('userGeneralCtrl', userGeneralCtrl);

  userGeneralCtrl
    .$inject = ['$rootScope', '$scope', '$stateParams', 'autocompleteService', 'Upload', 'User', 'Position'];

  function userGeneralCtrl($rootScope, $scope, $stateParams, autocompleteService, Upload, User, Position) {

    var vm = this;
    let userCopy = {};
    let positionCopy = {};
    let scheduleCopy = {};
    vm.user = {};
    vm.position = {};
    vm.schedule = {};
    vm.contractType = [
      'Full-time',
      'Part-time 4h',
      'Part-time 6h'
    ];


    vm.save = save;
    vm.savePosition = savePosition;
    vm.saveSchedule = saveSchedule;
    vm.saveCopy = saveCopy; // [1]
    vm.cancel = cancel; // [2]


    _getPositions();


    $rootScope.$on('event:userResourcesLoaded', function(event, resources) {
      vm.user = resources.user;
      saveCopy();

      _getUserPosition();
      _getUserSchedule();
    });


    function save() {
      User.update(vm.user).then((data) => {
        if (data) {
          vm.user = data;
        } else {
          _getUser();
        }
        vm.toggleForm();
      });
    }

    function saveCopy() {
      userCopy = angular.copy(vm.user);
      positionCopy = angular.copy(vm.position);
      scheduleCopy = angular.copy(vm.schedule);
    }

    function cancel() {
      vm.user = angular.copy(userCopy);
      vm.position = angular.copy(positionCopy);
      vm.schedule = angular.copy(scheduleCopy);
    }

    function savePosition() {
      User.updatePosition(vm.user, vm.position).then((data) => {
        vm.position = data;
      });
    }

    function saveSchedule() {
      // TODO: add functionality here
    }


    function _getPositions() {
      Position.getAll().then(data => vm.positions = data);
    }

    function _getUser() {
      User.getById($stateParams.id).then(data => vm.user = data);
    }

    // We can chain the following two promises
    function _getUserPosition() {
      User.getPosition(vm.user).then((data) => {
        vm.position = data;
        saveCopy();
      });
    }

    function _getUserSchedule() {
      User.getSchedule(vm.user).then((data) => {
        vm.schedule = data;
        saveCopy();
      });
    }

  }

})();

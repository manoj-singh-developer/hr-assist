(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('userGeneralCtrl', userGeneralCtrl);

  userGeneralCtrl
    .$inject = ['$rootScope', '$scope', '$stateParams', 'autocompleteService', 'Upload', 'User', 'Position', '$state'];

  function userGeneralCtrl($rootScope, $scope, $stateParams, autocompleteService, Upload, User, Position, $state) {

    var vm = this;
    let userCopy = {};
    let positionCopy = {};
    let scheduleCopy = {};
    vm.today = new Date();
    vm.isAdmin = false;
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
    vm.userLogOut = userLogOut;


    _getPositions();

    if ($rootScope.isAdmin === true) {
      vm.isAdmin = false;
    } else {
      vm.isAdmin = true;
    }

    $rootScope.$on('event:userResourcesLoaded', function(event, resources) {
      vm.user = resources.user;
      saveCopy();

      _getUserPosition();
    });

    $rootScope.$on('loadUserSchedule', (event, data) => {
      vm.schedule = data;
    });

    $rootScope.$on('notifyScheduleUpdate', (event, data) => {
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

    function userLogOut() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_token');

      $state.reload();
    }

  }

})();

((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectUsersCtrl', projectUsersCtrl);

  function projectUsersCtrl(Project, $rootScope, User, autocompleteService) {

    let vm = this;
    let usersToAdd = [];
    let usersToRemove = [];
    vm.project = {};
    vm.users = [];
    vm.prjUsers = [];
    vm.copyPrjUsers = [];
    vm.disableSaveBtn = true;
    vm.displayOrHide = false;

    _getUsers();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getPrjUsers();
    });

    vm.addInQueue = (users) => {
      if (users) {
        let notToAdd = _.findWhere(vm.copyPrjUsers, { id: users.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(usersToRemove, { id: users.id });
          usersToRemove = _.without(usersToRemove, toRemove);
          usersToAdd.push(users);
          vm.copyPrjUsers.push(users);
        }
        vm.searchText = ' ';
      }
      vm.disableSaveBtn = false;
    }

    vm.removeFromQueue = (users) => {
      let toRemove = _.findWhere(vm.copyPrjUsers, { id: users.id });
      vm.copyPrjUsers = _.without(vm.copyPrjUsers, toRemove);
      usersToAdd = _.without(usersToAdd, toRemove);
      usersToRemove.push(users.id);
      vm.disableSaveBtn = false;
    }

    vm.cancel = () => {
      vm.searchText = "";
      vm.copyPrjUsers = [];
      Project.getUsers(vm.project)
        .then((data) => {
          vm.prjUsers = data;
          vm.copyPrjUsers.push(...vm.prjUsers);
        });
      vm.disableSaveBtn = true;
    }

    vm.save = () => {

      if (usersToAdd.length > 0) {
        Project.saveUsers(vm.project, usersToAdd);
        usersToAdd = [];
      }

      if (usersToRemove.length > 0) {
        Project.removeUsers(vm.project, usersToRemove);
        usersToRemove = [];
      }

      vm.displayOrHide = false;
      vm.disableSaveBtn = true;
      vm.searchText = "";
    }

    function _getUsers() {
      User.getAll()
        .then((data) => {
          vm.users = data;
          debugger
          autocompleteService.buildList(vm.users, ['first_name', 'last_name']);
        });
    }

    function _getPrjUsers() {
      Project.getUsers(vm.project)
        .then((data) => {
          vm.prjUsers = data;
          vm.copyPrjUsers.push(...vm.prjUsers);
        });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectUsersCtrl', projectUsersCtrl);

  function projectUsersCtrl(Project, $rootScope, User, autocompleteService, $mdDialog, $stateParams) {

    let vm = this;
    let usersToAdd = [];
    let usersToRemove = [];
    vm.project = {};
    vm.users = [];
    vm.prjUsers = [];
    vm.copyPrjUsers = [];
    vm.disableSaveBtn = true;
    vm.teamLeader = {};

    vm.addInQueue = addInQueue;
    vm.addTeamLeader = addTeamLeader;
    vm.removeFromQueue = removeFromQueue;
    vm.cancel = cancel;
    vm.save = save;
    vm.removeLeader = removeLeader;
    vm.toggleForm = toggleForm;

    _getUsers();
    _getTeamLeader();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getPrjUsers();
    });

    function addInQueue(users) {
      if (users) {
        let notToAdd = _.findWhere(vm.copyPrjUsers, { id: users.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(usersToRemove, { id: users.id });
          usersToRemove = _.without(usersToRemove, toRemove);
          usersToAdd.push(users);
          vm.copyPrjUsers.push(users);
          _disableSaveBtn(false);
        }
        vm.searchText = ' ';
      }

    }

    function addTeamLeader(user) {
      if (user) {
        vm.teamLeader.team_leader_id = user.id;
        vm.teamLeader.first_name = user.first_name;
        vm.teamLeader.last_name = user.last_name;
        _disableSaveBtn(false);
      }
    }

    function removeFromQueue(users) {
      let toRemove = _.findWhere(vm.copyPrjUsers, { id: users.id });
      vm.copyPrjUsers = _.without(vm.copyPrjUsers, toRemove);
      usersToAdd = _.without(usersToAdd, toRemove);
      usersToRemove.push(users.id);
      _disableSaveBtn(false);
    }

    function cancel() {
      vm.searchText = '';
      vm.searchLeader = '';
      vm.copyPrjUsers = [];
      _getPrjUsers();
      _getTeamLeader();
      toggleForm();
      _disableSaveBtn(true);
    }

    function save() {
      vm.searchText = '';
      vm.searchLeader = '';
      let usersID = usersToAdd.map(user => user.id);
      let objToSave = {
        user_ids: usersID,
        team_leader_id: vm.teamLeader.team_leader_id || vm.project.team_leader_id
      }

      if (usersToAdd.length > 0 || vm.teamLeader.team_leader_id) {

        Project.saveUsers(vm.project, objToSave).then(() => {
          usersToAdd = [];
          _getPrjUsers();
          _getTeamLeader();
        });
      }

      if (usersToRemove.length > 0) {
        let user = {};
        user.usersToRemove = usersToRemove;
        Project.removeUsers(vm.project, user).then(() => {
          usersToRemove = [];
          _getPrjUsers();
          _getTeamLeader();
        });
      }
      toggleForm();
      _disableSaveBtn(true);
    }

    function removeLeader(leader) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + leader.first_name + ' ' + leader.last_name + ' leader?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        let user = {};
        user.team_leader_id = leader.id;
        Project.removeUsers(vm.project, user).then(() => {
          vm.searchLeader = '';
          _getTeamLeader();

        });
      });
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

    function _getUsers() {
      User.getAll()
        .then((data) => {
          vm.users = data;
          autocompleteService.buildList(vm.users, ['first_name', 'last_name']);
        });
    }

    function _getPrjUsers() {
      Project.getUsers(vm.project).then((data) => {
        vm.prjUsers = data;
        vm.copyPrjUsers = [];
        vm.copyPrjUsers.push(...vm.prjUsers);
      });
    }

    function _getTeamLeader() {
      Project.getById($stateParams.id).then((data) => {
        vm.project = data;
        let leader = vm.project.team_leader_id;
        if (leader) {
          User.getById(leader)
            .then((data) => {
              vm.teamLeader = data;
            })
        }
      });
    }

  }

})(_);

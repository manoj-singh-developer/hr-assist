((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('internsCtrl', internsCtrl);

  function internsCtrl($mdDialog, $rootScope, tableSettings, autocompleteService, Candidate) {

    var vm = this;
    
    vm.tableSettings = tableSettings;
    vm.querySearch = querySearch;
    vm.remove = remove;
    
    _getInterns();

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.interns);
    }

    function remove(intern, event) {
      let confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + intern.name + ' intern?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Candidate.remove(intern).then(() => {
          let toRemove = _.findWhere(vm.interns, { id: intern.id });
          vm.interns = _.without(vm.interns, toRemove);
          _updateTablePagination(vm.interns);
        });
      });
    }

    function _getInterns() {
      Candidate.getAll().then((data) => {
        vm.interns = [];

        data.forEach((element, index) => {

          if (element.status === 5) {
            vm.interns.push(element);
          }
        });

        _updateTablePagination(vm.interns);
        return autocompleteService.buildList(vm.interns, ['name']);
      });
    }

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
    }

  }

})(_);

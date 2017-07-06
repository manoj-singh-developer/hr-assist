((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidatesCtrl', candidatesCtrl);

  function candidatesCtrl($mdDialog, $rootScope, $q, autocompleteService, dateService, tableSettings, Candidate, Technology) {

    var vm = this;
    let querySearchItemsLength;
    let querySearchItems;
    vm.showFilters = false;
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    vm.resources = {};

    vm.showForm = showForm;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;


    _getResources();

    $rootScope.$on('event:projectAdd', (event, data) => {
      vm.candidate = vm.candidate.concat(data);
      autocompleteService.buildList(vm.candidate, ['name']);
    });


    function showForm() {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/candidates/form/candidateForm.view.html',
        controller: 'candidateFormCtrl',
        controllerAs: 'candidateForm',
        clickOutsideToClose: true,

      });
    }

    function remove(project, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + project.name + ' project?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Project.remove(project.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.candidate, { id: project.id });
            vm.candidate = _.without(vm.candidate, toRemove);
          }
        });
      });
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        vm.tableSettings.total = autocompleteService.querySearch(query, list).length;
        querySearchItemsLength = autocompleteService.querySearch(query, list).length;
        querySearchItems = autocompleteService.querySearch(query, list);
      } else {
        vm.tableSettings.total = list.length;
      }
      // _generateCSV();
      return autocompleteService.querySearch(query, list);

    }

    function _getResources() {
      let promises = [];

      promises.push(Candidate.getAll());
      promises.push(Technology.getAll());

      $q.all(promises).then((data) => {
        vm.resources.candidates = data[0];
        vm.resources.technologies = data[1];
        // debugger

        //will use this for filters
        vm.candidate = vm.resources.candidates;
        vm.candidateCopy = angular.copy(vm.candidate); //[1]
        tableSettings.total = vm.candidate.length;

        _buildAutocompleteLists();
        // _generateCSV();
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.candidate, ['name']);
      // autocompleteService.buildList(vm.resources.technologies, ['name']);
      // autocompleteService.buildList(vm.resources.industries, ['name']);
      // autocompleteService.buildList(vm.resources.customers, ['name']);
      // autocompleteService.buildList(vm.resources.application_types, ['name']);
    }

  }

})(_);

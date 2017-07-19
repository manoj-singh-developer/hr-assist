((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidatesCtrl', candidatesCtrl);

  function candidatesCtrl($mdDialog, $rootScope, $q, autocompleteService, dateService, tableSettings, Candidate) {

    let vm = this;
    let excelData = [];
    let exportCandidates = [];
    let querySearchItems = [];

    vm.showFilters = false;
    vm.resources = {};
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    vm.showForm = showForm;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.saveExcelFile = saveExcelFile;

    _getResources();

    $rootScope.$on('event:candidateAdd', (event, data) => {
      vm.candidate = vm.candidate.concat(data);
      autocompleteService.buildList(vm.candidate, ['name']);
    });


    function showForm(candidate) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + 'candidates/form/candidateForm.view.html',
        controller: 'candidateFormCtrl',
        controllerAs: 'candidateForm',
        clickOutsideToClose: true,
        data: {
          candidate: angular.copy(candidate),
        }
      });
    }

    function remove(candidate, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + candidate.name + ' candidate?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Project.remove(candidate.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.candidate, { id: candidate.id });
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
        querySearchItems = autocompleteService.querySearch(query, list);
        _generateXlsx();
      } else {
        vm.tableSettings.total = list.length;
        _generateXlsx();
      }
      return autocompleteService.querySearch(query, list);

    }

    function saveExcelFile() {
      let opts = [{
        sheetid: 'Candidates Raport',
        headers: false
      }];
      let res = alasql('SELECT INTO XLSX("Candidates Raport.xlsx",?) FROM ? ORDER BY name', [opts, [excelData]]);
    }

    function _getResources() {
      let promises = [];
      promises.push(Candidate.getAll());
      $q.all(promises).then((data) => {
        vm.resources.candidates = data[0];

        vm.candidate = vm.resources.candidates;
        vm.candidateCopy = angular.copy(vm.candidate);
        tableSettings.total = vm.candidate.length;
        _buildAutocompleteLists();
        _generateXlsx();
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.candidateCopy, ['name']);
    }

    function _generateXlsx() {
      excelData = [];
      exportCandidates = vm.searchText ? querySearchItems : vm.candidate;

      let tableHeader = {
        name: 'Name',
        contact_info: 'Contact Info',
        technologies: 'Technologies',
        projects: 'Projects'
      };

      if (exportCandidates) {
        angular.forEach(exportCandidates, function(value, key) {
          excelData.push({
            name: value.name,
            contact_info: value.contact_info ? value.contact_info : '',
            technologies: value.technologies ? value.technologies : '',
            projects: value.projects ? value.projects : ''
          });
        });

        Array.prototype.sortOn = function(key) {
          this.sort(function(a, b) {
            if (a[key].toLowerCase() < b[key].toLowerCase()) {
              return -1;
            } else if (a[key].toLowerCase() > b[key].toLowerCase()) {
              return 1;
            }
            return 0;
          });
        };

        excelData.sortOn('name');
        excelData.unshift(tableHeader);

        return excelData;
      }
    }


  }

})(_);

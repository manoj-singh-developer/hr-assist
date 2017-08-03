((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidatesCtrl', candidatesCtrl);

  function candidatesCtrl($mdDialog, $rootScope, $q, autocompleteService, dateService, Candidate, tableSettings) {

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
    vm.getTechnologyLvlTxt = getTechnologyLvlTxt;

    _getResources();

    $rootScope.$on('event:candidateAdd', (event, data) => {
      vm.candidate = vm.candidate.concat(data);
      autocompleteService.buildList(vm.candidate, ['name']);
    });

    $rootScope.$on('event:candidateEdited', (event, data) => {
      let editedCandidate = _.findWhere(vm.candidate, { id: data[0].id });
      vm.candidate = _.without(vm.candidate, editedCandidate);
      vm.candidate = vm.candidate.concat(data);
      autocompleteService.buildList(vm.candidate, ['name']);
    });

    $rootScope.$on('event:candidateTechRemoved', (event, data) => {
      _getResources();
    });
    $rootScope.$on('event:candidateFilesRemoved', (event, data) => {
      _getResources();
    });


    function showForm(candidate) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + 'candidates/form/candidateForm.view.html',
        controller: 'candidateFormCtrl',
        controllerAs: 'candidateForm',
        clickOutsideToClose: true,
        data: {
          candidate: angular.copy(candidate)
        }
      });
    }

    function getTechnologyLvlTxt(data) {
      switch (data) {
        case 1:
          return "Junior";
          break;
        case 2:
          return "Junior";
          break;
        case 3:
          return "Junior-Mid";
          break;
        case 4:
          return "Junior-Mid";
          break;
        case 5:
          return "Mid";
          break;
        case 6:
          return "Mid";
          break;
        case 7:
          return "Mid-Senior";
          break;
        case 8:
          return "Mid-Senior";
          break;
        case 9:
          return "Senior";
          break;
        case 10:
          return "Senior";
          break;
        default:
          return "Not selected";
      }
    }

    function remove(candidate, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + candidate.name + ' candidate?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Candidate.remove(candidate).then(() => {
          let toRemove = _.findWhere(vm.candidate, { id: candidate.id });
          vm.candidate = _.without(vm.candidate, toRemove);
          _updateTablePagination(vm.candidate);
          _generateXlsx();
        });
      });
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        _updateTablePagination(autocompleteService.querySearch(query, list));
        querySearchItems = autocompleteService.querySearch(query, list);
        _generateXlsx();
      } else {
        _updateTablePagination(list);
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
        _updateTablePagination(vm.candidate);
        _buildAutocompleteLists();
        _generateXlsx();
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.candidate, ['name']);
    }

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
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
          let technologies = [];

          if (value.technologies) {
            angular.forEach(value.technologies, (technology, index) => {
              technologies.push(technology.name + ': ' + getTechnologyLvlTxt(technology.level));
            });
          }

          excelData.push({
            name: value.name,
            contact_info: value.contact_info ? value.contact_info : '',
            technologies: value.technologies ? technologies.join(', ') : '',
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

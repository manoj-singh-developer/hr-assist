((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidatesCtrl', candidatesCtrl);

  function candidatesCtrl($mdDialog, $rootScope, $q, autocompleteService, dateService, Candidate, tableSettings, Technology) {

    let vm = this;
    let excelData = [];
    let exportCandidates = [];
    let querySearchItems = [];
    let technologies = [];
    let filterObj = {};
    let statusNumber = null;

    vm.selectedTechnologies = [];
    vm.showFilters = false;
    vm.resources = {};
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'name',
      limit: 10,
      page: 1
    };
    vm.filters = {
      technologies: [],
      category: null
    };
    vm.status = ['applied', 'meeting', 'test', 'accepted', 'failed'];

    vm.search = search;
    vm.showForm = showForm;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.saveExcelFile = saveExcelFile;
    vm.getTechnologyLvlTxt = getTechnologyLvlTxt;
    vm.addTechnologyInFilter = addTechnologyInFilter;
    vm.selectedStatus = selectedStatus;
    vm.resetFilters = resetFilters;

    _getResources();

    $rootScope.$on('event:candidateAdd', (event, data) => {
      vm.candidates = vm.candidates.concat(data);
      autocompleteService.buildList(vm.candidates, ['name']);
    });

    $rootScope.$on('event:candidateEdited', (event, data) => {
      let editedCandidate = _.findWhere(vm.candidates, { id: data[0].id });
      vm.candidates = _.without(vm.candidates, editedCandidate);
      // status greater than 5 respresent status of intership or employee
      if (data[0].status < 5) {
        vm.candidates = vm.candidates.concat(data);
      }
      autocompleteService.buildList(vm.candidates, ['name']);
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

    function addTechnologyInFilter() {
      vm.filters.technologies.push({});
    }

    function selectedStatus(data) {
      if (data) {
        statusNumber = vm.status.indexOf(data);
        return data;
      } else {
        return "Pick a status";
      }
    }

    function search() {
      _createTechArray();
      _createFilterObj();

      if (!angular.equals(filterObj, {})) {

        Candidate.filter(filterObj).then((data) => {
          technologies = [];
          vm.candidates = data;
          _generateXlsx();
          _updateTablePagination(vm.candidates);
        });

      }
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
      let confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + candidate.name + ' candidate?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Candidate.remove(candidate).then(() => {
          let toRemove = _.findWhere(vm.candidates, { id: candidate.id });
          vm.candidates = _.without(vm.candidates, toRemove);
          _updateTablePagination(vm.candidates);
          _generateXlsx();
        });
      });
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function resetFilters() {

      angular.forEach(vm.filters, (item, key) => {
        if (typeof vm.filters[key] === 'object' && vm.filters[key] instanceof Array) {
          vm.filters[key] = [];
        } else {
          vm.filters[key] = null;
        }
      });

      vm.searchText = '';
      technologies = [];
      statusNumber = null;
      vm.selectedTechnologies = [];
      filterObj = {};
      vm.candidates = vm.candidatesCopy;

      _generateXlsx();
      _updateTablePagination(vm.candidates);
    }

    function querySearch(query, list) {
      if (query) {
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
      vm.candidates = [];

      promises.push(Candidate.getAll());
      promises.push(Technology.getAll());

      $q.all(promises).then((data) => {
        vm.resources.candidates = data[0];
        vm.resources.technologies = data[1];

        if (vm.resources.candidates) {
          vm.resources.candidates.forEach((element, index) => {
            // status greater than 5 respresent status of intership or employee
            if (element.status < 5) {
              vm.candidates.push(element);
            }
          });
        }
        vm.candidatesCopy = vm.candidates;
        _updateTablePagination(vm.candidates);
        _buildAutocompleteLists();
        _generateXlsx();
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.candidates, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name'])
    }

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
    }

    function _generateXlsx() {
      excelData = [];
      exportCandidates = vm.searchText ? querySearchItems : vm.candidates;

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

    function _createTechArray() {
      if (vm.selectedTechnologies) {
        vm.selectedTechnologies.forEach(function(element, index) {
          if (element) {
            technologies.push(element.id);
          }
        });
      }
    }

    function _createFilterObj() {
      if (vm.filters.projects) {
        vm.filters.projects.forEach((element, index) => {
          projects.push(element.id);
        });
      }

      filterObj = {
        technology_id: technologies,
        status: statusNumber,
        category: vm.filters.category
      };

      for (let key in filterObj) {
        if (!filterObj[key] || filterObj[key].length == 0) {
          delete filterObj[key];
        }
      }

      if (!angular.equals(filterObj, {})) {
        filterObj = {
          filters: filterObj
        }
      }
    }

  }

})(_);

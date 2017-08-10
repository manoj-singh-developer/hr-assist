((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('internsCtrl', internsCtrl);

  function internsCtrl(autocompleteService, Candidate, tableSettings) {

    let vm = this;
    let excelData = [];
    let exportCandidates = [];
    let querySearchItems = [];

    vm.tableSettings = tableSettings;
    vm.querySearch = querySearch;
    vm.saveExcelFile = saveExcelFile;
    vm.getTechnologyLvlTxt = getTechnologyLvlTxt;

    _getInterns();

    function querySearch(query, list) {
      if (query) {
        _updateTablePagination(autocompleteService.querySearch(query, list));
        querySearchItems = autocompleteService.querySearch(query, list);
        _generateXlsx();
      } else {
        _updateTablePagination(list);
        _generateXlsx();
      }
      return autocompleteService.querySearch(query, vm.interns);
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

    function saveExcelFile() {
      let opts = [{
        sheetid: 'Interns Raport',
        headers: false
      }];
      let res = alasql('SELECT INTO XLSX("Interns Raport.xlsx",?) FROM ? ORDER BY name', [opts, [excelData]]);
    }

    function _getInterns() {
      Candidate.getAll().then((data) => {
        vm.interns = [];
        if (data) {
          data.forEach((element, index) => {
            if (element.status === 5) {
              vm.interns.push(element);
            }
          });
        }

        _generateXlsx();
        _updateTablePagination(vm.interns);
        return autocompleteService.buildList(vm.interns, ['name']);
      });
    }

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
    }

    function _generateXlsx() {
      excelData = [];
      exportCandidates = vm.searchText ? querySearchItems : vm.interns;

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

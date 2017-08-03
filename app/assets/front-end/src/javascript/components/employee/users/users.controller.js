((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('usersCtrl', usersCtrl);

  function usersCtrl($mdDialog, $rootScope, $q, AppType, autocompleteService, dateService, Project, User, Technology, tableSettings) {

    let vm = this;
    let excelData = [];
    let exportUsers = [];
    let querySearchItems = [];
    let filterObj = {};

    let technologies = [];
    let languages = [];
    let projects = [];

    vm.showFilters = false;
    vm.selectedTechnologies = [];
    vm.selectedLanguages = [];
    vm.users = [];
    vm.monthSelection = [];
    vm.resources = {};
    vm.usersCopy = {};
    vm.getLanguageLvlTxt = getLanguageLvlTxt;
    vm.getTechnologyLvlTxt = getTechnologyLvlTxt;
    vm.dateService = dateService;
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'last_name',
      limit: 10,
      page: 1
    };
    vm.filters = {
      technologies: [],
      languages: [],
      projects: [],
      start_date: undefined,
      university_year: undefined
    };
    vm.technologiesText = [{
      title: "Junior",
      level: 1
    }, {
      title: "Junior",
      level: 2
    }, {
      title: "Junior-Mid",
      level: 3
    }, {
      title: "Junior-Mid",
      level: 4
    }, {
      title: "Mid",
      level: 5
    }, {
      title: "Mid",
      level: 6
    }, {
      title: "Mid-Senior",
      level: 7
    }, {
      title: "Mid-Senior",
      level: 8
    }, {
      title: "Senior",
      level: 9
    }, {
      title: "Senior",
      level: 10
    }];

    vm.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    _getResources();

    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.resetFilters = resetFilters;
    vm.saveExcelFile = saveExcelFile;
    vm.search = search;
    vm.addNewTechnology = addNewTechnology;
    vm.addNewLanguages = addNewLanguages;
    vm.selectedMonthDate = selectedMonthDate;

    function addNewTechnology() {
      vm.filters.technologies.push({});
    }

    function addNewLanguages() {
      if (!vm.filters.languages) {
        vm.filters.languages.push({});
      } else {
        vm.filters.languages.push({});
      }
    }

    function search() {

      _createTechArray();
      _createLangArray();
      _createFilterObj();

      if (!angular.equals(filterObj, {})) {
        User.filter(filterObj).then((data) => {
          vm.users = data;
          _generateXlsx();
          _updateTablePagination(vm.users);
          technologies = [];
          languages = [];
          projects = [];
        });
      }

    }

    function selectedMonthDate(data) {
      if (data) {
        let indexOfMonth = vm.monthsList.indexOf(data);
        vm.birthday = new Date();
        vm.birthday.setMonth(indexOfMonth);
        return data;
      } else {
        return "Pick a month";
      }
    }

    function remove(employee, event) {
      let confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + employee.first_name + " " + employee.last_name + ' employee?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        User.remove(employee.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.users, { id: employee.id });
            vm.users = _.without(vm.users, toRemove);
            _updateTablePagination(vm.users);
          }
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

      technologies = [];
      languages = [];
      projects = [];
      vm.selectedTechnologies = [];
      vm.selectedLanguages = [];
      vm.selectedMonth = null;
      filterObj = {};
      vm.birthday = null;
      vm.users = vm.usersCopy;
      exportUsers = vm.usersCopy;
      _generateXlsx();
      _updateTablePagination(vm.users);
    }

    function querySearch(query, list) {
      if (query) {
        vm.firstNameFilter = vm.searchText.substr(0, vm.searchText.indexOf(' '));
        querySearchItems = autocompleteService.querySearch(query, list);
        _updateTablePagination(autocompleteService.querySearch(query, list));
      } else {
        _updateTablePagination(list);
        vm.firstNameFilter = '';
      }
      _generateXlsx();
      return autocompleteService.querySearch(query, list);
    }

    function saveExcelFile() {

      let opts = [{
        sheetid: 'Employee Raport',
        headers: false
      }];
      let res = alasql('SELECT INTO XLSX("Employee Raport.xlsx",?) FROM ? ORDER BY firstName', [opts, [excelData]]);
    }

    function getLanguageLvlTxt(data) {
      switch (data) {
        case 1:
          return "Elementary proficiency";
          break;
        case 2:
          return "Limited working proficiency";
          break;
        case 3:
          return "Professional working proficiency";
          break;
        case 4:
          return "Full professional proficiency";
          break;
        case 5:
          return "Native or bilingual proficiency";
          break;
        default:
          return "Not selected";
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

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
    }

    function _getResources() {
      let promises = [];

      promises.push(Project.getAll());
      promises.push(Technology.getAll());
      promises.push(User.getAll());
      promises.push(User.getLanguages());
      promises.push(AppType.getAll());

      $q.all(promises).then((data) => {

        vm.resources.projects = data[0];
        vm.resources.technologies = data[1];
        vm.resources.users = data[2];
        vm.resources.languages = data[3];

        vm.users = vm.resources.users;
        vm.usersCopy = angular.copy(vm.resources.users);
        _updateTablePagination(vm.resources.users);
        _buildAutocompleteLists();
        _generateXlsx();
      });
    }

    function _buildAutocompleteLists() {

      autocompleteService.buildList(vm.resources.projects, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name']);
      autocompleteService.buildList(vm.resources.languages, ['long_name']);
      autocompleteService.buildList(vm.usersCopy, ['last_name', 'first_name']);
    }

    function _generateXlsx() {
      excelData = [];

      let tableHeader = {
        lastName: 'Last Name',
        firstName: 'First Name',
        email: 'Email',
        phone: 'Phone',
        languages: 'Languages & level',
        technologies: 'Technologies & level',
        projects: 'Projects',
        certifications: 'Certifications',
        startDate: 'Start date Assist'
      };

      if (vm.searchText) {
        exportUsers = querySearchItems;
      } else {
        exportUsers = vm.users;
      }

      if (exportUsers) {
        for (let i = 0; i < exportUsers.length; i++) {
          let languages = [];
          let technologies = [];
          let projects = [];
          let certifications = [];

          if (exportUsers[i].languages) {
            angular.forEach(exportUsers[i].languages, (value, index) => {
              languages.push(value.long_name + ': ' + vm.getLanguageLvlTxt(value.level));
            });
          }

          if (exportUsers[i].technologies) {
            angular.forEach(exportUsers[i].technologies, (value, index) => {
              technologies.push(value.name + ': ' + vm.getLanguageLvlTxt(value.level));
            });
          }

          if (exportUsers[i].projects) {
            angular.forEach(exportUsers[i].projects, (value, index) => {
              projects.push(value.name);
            });
          }

          if (exportUsers[i].certifications) {
            angular.forEach(exportUsers[i].certifications, (value, index) => {
              certifications.push(value.name);
            });
          }

          excelData.push({
            lastName: exportUsers[i].last_name,
            firstName: exportUsers[i].first_name,
            email: exportUsers[i].email,
            phone: exportUsers[i].phone ? exportUsers[i].phone.toString() : '',
            languages: languages.join(', '),
            technologies: technologies.join(', '),
            projects: projects.join(', '),
            certifications: certifications,
            startDate: exportUsers[i].company_start_date ? exportUsers[i].company_start_date : ''
          });
        }

        Array.prototype.sortOn = function(key) {
          this.sort(function(a, b) {
            if (a[key] < b[key]) {
              return -1;
            } else if (a[key] > b[key]) {
              return 1;
            }
            return 0;
          });
        };

        excelData.sortOn('lastName');
        excelData.unshift(tableHeader);

        return excelData;
      }

    }

    function _createTechArray() {
      if (vm.selectedTechnologies) {
        vm.selectedTechnologies.forEach(function(element, index) {
          technologies.push({
            technology_id: element.id,
            technology_level: element.level ? element.level : null
          });
        });
        _deleteEmptyPropInArrayOfObj(technologies);
      }
    }

    function _createLangArray() {
      if (vm.selectedLanguages) {
        vm.selectedLanguages.forEach(function(element, index) {
          languages.push({
            language_id: element.id,
            language_level: element.level ? element.level : null
          });
        });
        _deleteEmptyPropInArrayOfObj(languages);
      }
    }

    function _createFilterObj() {
      if (vm.filters.projects) {
        vm.filters.projects.forEach((element, index) => {
          projects.push(element.id);
        });
      }

      filterObj = {
        birthday: vm.birthday ? vm.dateService.format(vm.birthday) : null,
        university_year: vm.filters.university_year ? parseInt(vm.filters.university_year) : null,
        start_date: vm.filters.start_date ? vm.dateService.format(new Date(vm.filters.start_date)) : vm.filters.start_date,
        projects: projects,
        languages: languages,
        technologies: technologies,
        certifications: vm.filters.certifications
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

    function _deleteEmptyPropInArrayOfObj(array) {
      array.forEach(function(element, index) {

        for (let key in element) {
          if (!element[key] || element[key].length == 0) {
            delete element[key];
          }
        }
      });
    }

  }

})(_);

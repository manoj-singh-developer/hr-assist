((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('usersCtrl', usersCtrl);

  function usersCtrl($mdDialog, $rootScope, $scope, $q, AppType, autocompleteService, dateService, Project, User, Technology, tableSettings) {

    let vm = this;
    let excelData = [];
    let exportUsers = [];

    vm.showFilters = false;
    vm.technologiesLvl = [];
    vm.selectedTechnologies = [];
    vm.selectedLanguages = [];
    vm.languagesLvl = [];
    vm.users = [];
    vm.resources = {};
    vm.usersCopy = {};
    vm.dateService = dateService;
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'last_name',
      limit: 10,
      page: 1
    };
    vm.filters = {
      technologies: [],
      // technologies: [{}], // FOR TECHNOLOGIES WITH LEVEL
      languages: [],
      // languages: [{}], // FOR LANGUAGES WITH LEVEL
      projects: [],
      start_date: undefined,
      birthday: undefined,
      university_year: undefined
    };

    _getResources();

    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.resetFilters = resetFilters;
    vm.saveExcelFile = saveExcelFile;
    vm.search = search;
    vm.addNewTechnology = addNewTechnology;
    vm.addNewLanguages = addNewLanguages;

    function addNewTechnology() {
      vm.filters.technologies.push({});
    }

    function addNewLanguages() {
      vm.filters.languages.push({});
    }

    function search() {
      let filterObj = {};
      let technologies = [];
      let languages = [];
      let projects = [];

      // FOR TECHNOLOGIES AND LEVEL WHITHOUT LEVEL
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      vm.filters.technologies.forEach((element, index) => {
        technologies.push(element.id);
      });

      vm.filters.languages.forEach((element, index) => {
        languages.push(element.id);
      });
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // FOR TECHNOLOGIES AND LEVEL WHITHOUT LEVEL

      // FOR TECHNOLOGIES WITH LEVEL
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // let technologiesIdArr = _getItemId(vm.selectedTechnologies);
      // let technologieslvlArr =  _getItemValues(vm.technologiesLvl);

      // for (let i = 0; i < vm.selectedTechnologies.length; i++) {
      //   technologies.push({
      //     technology_id: technologiesIdArr[i],
      //     technology_level: technologieslvlArr[i] ? technologieslvlArr[i] : 1
      //   });
      // }
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //END FOR TECHNOLOGIES WITH LEVEL


      // FOR LANGUAGES WITH LEVEL
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // let languagesIdArr = _getItemId(vm.selectedLanguages);
      // let languagesLvlArr = _getItemValues(vm.languagesLvl);

      // for (let i = 0; i < vm.selectedLanguages.length; i++) {
      //   languages.push({
      //     language_id: languagesIdArr[i],
      //     level: languagesLvlArr[i] ? languagesLvlArr[i] : 1
      //   });
      // }

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //END FOR LANGUAGES WITH LEVEL


      vm.filters.projects.forEach((element, index) => {
        projects.push(element.id);
      });

      filterObj = {
        birthday: vm.filters.birthday ? vm.dateService.format(new Date(vm.filters.birthday)) : vm.filters.birthday,
        university_year: vm.filters.university_year,
        start_date: vm.filters.start_date ? vm.dateService.format(new Date(vm.filters.start_date)) : vm.filters.start_date,
        projects: projects,
        languages: languages,
        technologies: technologies
      };


      for (let key in filterObj) {
        if (!filterObj[key] || filterObj[key].length == 0) {
          delete filterObj[key];
        }
      }

      filterObj = {
        filters: filterObj
      }

      User.filter(filterObj).then((data) => {
        vm.users = data;
        _generateXlsx();
        _updateTablePagination(vm.users);
      });
    }

    function showForm(device) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/device/form/deviceForm.view.html',
        controller: 'deviceFormCtrl',
        controllerAs: 'deviceForm',
        clickOutsideToClose: true,
        data: {
          device: angular.copy(device),
        }
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + '/device/formJson/deviceFormJson.view.html',
        controller: 'deviceFormJsonCtrl',
        controllerAs: 'deviceFormJson',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(employee, event) {
      var confirm = $mdDialog.confirm()
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
        if (typeof vm.filters[key] === 'object') {
          vm.filters[key] = [];
        } else {
          vm.filters[key] = undefined;
        }
      });
      vm.users = vm.usersCopy;
      _updateTablePagination(vm.users);

    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        _updateTablePagination(autocompleteService.querySearch(query, list));
      } else {
        _updateTablePagination(list);
      }
      exportUsers = autocompleteService.querySearch(query, list);
      _generateXlsx();

      return autocompleteService.querySearch(query, list);
    }

    function saveExcelFile() {

      var opts = [{
        sheetid: 'Employee Raport',
        headers: false
      }];
      var res = alasql('SELECT INTO XLSX("Employee Raport.xlsx",?) FROM ? ORDER BY firstName', [opts, [excelData]]);
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

        //will use this for filters
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
      exportUsers = vm.users;
      excelData = [];

      let tableHeader = {
        lastName: 'Last Name',
        firstName: 'First Name',
        email: 'Email',
        phone: 'Phone',
        languages: 'Languages',
        technologies: 'Technologies',
        projects: 'Projects',
        startDate: 'Start date Assist'
      };

      if (exportUsers) {
        for (let i = 0; i < exportUsers.length; i++) {
          let languages = [];
          let technologies = [];
          let projects = [];

          if (exportUsers[i].languages) {
            for (let j = 0; j < exportUsers[i].languages.length; j++) languages.push(exportUsers[i].languages[j].long_name);
          }

          if (exportUsers[i].technologies) {
            for (let j = 0; j < exportUsers[i].technologies.length; j++) technologies.push(exportUsers[i].technologies[j].name);
          }

          if (exportUsers[i].projects) {
            for (let j = 0; j < exportUsers[i].projects.length; j++) projects.push(exportUsers[i].projects[j].name);
          }

          excelData.push({
            lastName: exportUsers[i].last_name,
            firstName: exportUsers[i].first_name,
            email: exportUsers[i].email,
            phone: exportUsers[i].phone ? exportUsers[i].phone.toString() : '',
            languages: languages.join(', '),
            technologies: technologies.join(', '),
            projects: projects.join(', '),
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

    function _getItemId(itemsArray) {
      return $.map(itemsArray, (value, index) => {
        return value.id;
      });
    }

    function _getItemValues(itemsArray) {
      return $.map(itemsArray, (value, index) => {
        return eval(value);
      });
    }
  }

})(_);

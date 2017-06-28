((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('usersCtrl', usersCtrl);

  function usersCtrl($scope, $rootScope, $mdDialog, autocompleteService, User, Technology, Project, AppType, $q, tableSettings, dateService) {

    let vm = this;
    let querySearchItems;
    let excelData = [];
    let exportUsers = [];

    vm.ids = [];
    vm.selected = [];
    vm.users = [];
    vm.resources = {};
    vm.dateService = dateService;
    // vm.filterType = filterService.getTypes();
    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'last_name',
      limit: 10,
      page: 1
    };

    vm.showFilters = false;
    // vm.filters = {
    //   technologies: [],
    //   languages: [],
    //   projects: []
    // };

    vm.search = {
      technologies: '',
      languages: '',
      projects: ''
    };

    vm.filterInput = {
      technologies: [],
      languages: [],
      projects: [],
      start_date: undefined,
      birthday: undefined,
      university_year: undefined
    };
    _getResources();

    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.resetFilters = resetFilters;
    vm.saveExcelFile = saveExcelFile;
    vm.search = search;

    function search() {
      let filterObj = {};
      let technologies = [];
      let languages = [];
      let projects = [];

      vm.filterInput.technologies.forEach((element, index) => {
        // technologies.push({
        //   technology_id: element.id,
        //   technology_level: 3
        // });
        technologies.push(element.id);
      });

      vm.filterInput.languages.forEach((element, index) => {
        // languages.push({
        //   language_id: element.id,
        //   level: 3
        // });
        languages.push(element.id);
      });

      vm.filterInput.projects.forEach((element, index) => {
        projects.push(element.id);
      });

      filterObj = {
        birthday: vm.filterInput.birthday ? vm.dateService.format(new Date(vm.filterInput.birthday)) : vm.filterInput.birthday,
        university_year: vm.filterInput.university_year ? vm.dateService.format(new Date(vm.filterInput.university_year)) : vm.filterInput.university_year,
        start_date: vm.filterInput.start_date ? vm.dateService.format(new Date(vm.filterInput.start_date)) : vm.filterInput.start_date,
        projects: projects,
        languages: languages,
        technologies: technologies
      };

      for (var key in filterObj) {

        if (!filterObj[key] || filterObj[key].length == 0) {
          delete filterObj[key];
        }
      }

      filterObj = {
        filters: filterObj
      }
      User.filter(filterObj).then((data) => {
        vm.users = data;
        console.log(data);

      });
      console.log(JSON.stringify(filterObj));
      console.log(filterObj);
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

    function multipleRemove() {}

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function resetFilters() {
      angular.forEach(vm.filterInput, (item, key) => {
        if (typeof vm.filterInput[key] === 'object') {
          vm.filterInput[key] = [];
        } else {
          vm.filterInput[key] = undefined;
        }
      });
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        vm.tableSettings.total = autocompleteService.querySearch(query, list).length;
        querySearchItems = autocompleteService.querySearch(query, list).length;
      } else {
        vm.tableSettings.total = list.length;
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
      vm.tableSettings.total = data.length;
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
        vm.usersCopy = angular.copy(vm.resources.users); //[1]
        vm.tableSettings.total = vm.resources.users.length;
        _buildAutocompleteLists();

        exportUsers = vm.users;
        _generateXlsx();
      });
    }

    function _buildAutocompleteLists() {

      autocompleteService.buildList(vm.resources.projects, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name']);
      autocompleteService.buildList(vm.resources.languages, ['long_name']);
      autocompleteService.buildList(vm.resources.users, ['last_name', 'first_name']);
    }

    function _generateXlsx() {
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

      if (exportUsers.length) {
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

  }

})(_);


((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  function projectsCtrl($mdDialog, $rootScope, $q, AppType, autocompleteService, Customer, filterService, Industry, Project, tableSettings, Technology) {

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
    vm.filterType = filterService.getTypes();
    vm.filters = {
      technologies: [],
      industries: [],
      customers: [],
      application_types: []
    };

    vm.search = {
      technologies: '',
      industries: '',
      customers: '',
      application_types: ''
    };

    vm.showForm = showForm;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.filterProjects = filterProjects;
    vm.resetFilters = resetFilters;
    vm.csvHeader = csvHeader;

    _getResources();

    $rootScope.$on('event:projectAdd', (event, data) => {
      vm.projects = vm.projects.concat(data);
      autocompleteService.buildList(vm.projects, ['name']);
    });


    function showForm(project) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/project/form/projectForm.view.html',
        controller: 'projectFormCtrl',
        controllerAs: 'projectForm',
        clickOutsideToClose: true,
        data: {
          project: angular.copy(project),
        }
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
            let toRemove = _.findWhere(vm.projects, { id: project.id });
            vm.projects = _.without(vm.projects, toRemove);
          }
        });
      });
    }

    function multipleRemove() {}

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function filterProjects(filteringType) {
      vm.projects = filterService.filter(
        vm.projects,
        vm.projectsCopy,
        vm.filters,
        filteringType);
      vm.tableSettings.total = vm.searchProject && querySearchItemsLength < vm.projects.length ? querySearchItemsLength : vm.projects.length;
      _generateCSV();
    }

    function resetFilters() {
      angular.forEach(vm.filters, (item, key) => { vm.filters[key] = []; });
      filterProjects();
      vm.searchProject = '';
    }

    function querySearch(query, list) {
      if (query) {
        vm.tableSettings.total = autocompleteService.querySearch(query, list).length;
        querySearchItemsLength = autocompleteService.querySearch(query, list).length;
        querySearchItems = autocompleteService.querySearch(query, list);
      } else {
        vm.tableSettings.total = list.length;
      }
      _generateCSV();
      return autocompleteService.querySearch(query, list);

    }

    function _getResources() {
      let promises = [];

      promises.push(Project.getAll());
      promises.push(Technology.getAll());
      promises.push(Customer.getAll());
      promises.push(Industry.getAll());
      promises.push(AppType.getAll());

      $q.all(promises).then((data) => {
        vm.resources.projects = data[0];
        vm.resources.technologies = data[1];
        vm.resources.customers = data[2];
        vm.resources.industries = data[3];
        vm.resources.application_types = data[4];

        //will use this for filters
        vm.projects = vm.resources.projects;
        vm.projectsCopy = angular.copy(vm.projects); //[1]
        tableSettings.total = vm.projects.length;

        _buildAutocompleteLists();
        _generateCSV();
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.projects, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name']);
      autocompleteService.buildList(vm.resources.industries, ['name']);
      autocompleteService.buildList(vm.resources.customers, ['name']);
      autocompleteService.buildList(vm.resources.application_types, ['name']);
    }

    function csvHeader() {
      return ["Project Name", "Start Date", "End Date", "Application Type", "Industry", "Customers", "Technologies", "Employees"]
    }

    function _generateCSV() {
      vm.csvData = [];
      let csvObject = [];

      if (vm.searchProject) {
        csvObject = querySearchItems;
      } else {
        csvObject = vm.projects;
      }

      for (let i = 0; i < csvObject.length; i++) {
        let appType = [];
        let industries = [];
        let customers = [];
        let technologies = [];
        let employees = [];

        if (csvObject[i].application_types) {
          for (let j = 0; j < csvObject[i].application_types.length; j++) appType.push(csvObject[i].application_types[j].name);
        }

        if (csvObject[i].industries) {
          for (let j = 0; j < csvObject[i].industries.length; j++) industries.push(csvObject[i].industries[j].name);
        }

        if (csvObject[i].customers) {
          for (let j = 0; j < csvObject[i].customers.length; j++) customers.push(csvObject[i].customers[j].name);
        }

        if (csvObject[i].technologies) {
          for (let j = 0; j < csvObject[i].technologies.length; j++) technologies.push(csvObject[i].technologies[j].name);
        }

        if (csvObject[i].users) {
          for (let j = 0; j < csvObject[i].users.length; j++) employees.push(csvObject[i].users[j].first_name + " " + csvObject[i].users[j].last_name);
        }

        vm.csvData.push({
          name: csvObject[i].name,
          startDate: csvObject[i].start_date,
          endDate: csvObject[i].end_date,
          applicationTypes: appType.join(),
          industries: industries.join(),
          customers: customers.join(),
          technologies: technologies.join(),
          employees: employees.join()
        });
      }

      return vm.csvData;
    }

  }


})(_);

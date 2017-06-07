((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  function projectsCtrl($scope, $stateParams, $q, $rootScope, $mdDialog, $filter, tableSettings, autocompleteService, filterService, Project, Technology, Customer, Industry, AppType) {

    var vm = this;
    let QuerySearchItems;
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
      vm.tableSettings.total = vm.searchProject && QuerySearchItems < vm.projects.length ? QuerySearchItems : vm.projects.length;
    }

    function resetFilters() {
      angular.forEach(vm.filters, (item, key) => { vm.filters[key] = []; });
      filterProjects();
      vm.searchProject = '';
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        vm.tableSettings.total = autocompleteService.querySearch(query, list).length;
        QuerySearchItems = autocompleteService.querySearch(query, list).length;
      } else {
        vm.tableSettings.total = list.length;
      }
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

      for (let i = 0; i < vm.projects.length; i++) {
        let appType = [];
        let industries = [];
        let customers = [];
        let technologies = [];
        let employees = [];

        if (vm.projects[i].application_types) {
          for (let j = 0; j < vm.projects[i].application_types.length; j++) appType.push(vm.projects[i].application_types[j].name);
        }

        if (vm.projects[i].industries) {
          for (let j = 0; j < vm.projects[i].industries.length; j++) industries.push(vm.projects[i].industries[j].name);
        }

        if (vm.projects[i].customers) {
          for (let j = 0; j < vm.projects[i].customers.length; j++) customers.push(vm.projects[i].customers[j].name);
        }

        if (vm.projects[i].technologies) {
          for (let j = 0; j < vm.projects[i].technologies.length; j++) technologies.push(vm.projects[i].technologies[j].name);
        }

        if (vm.projects[i].users) {
          for (let j = 0; j < vm.projects[i].users.length; j++) employees.push(vm.projects[i].users[j].first_name + " " + vm.projects[i].users[j].last_name);
        }

        vm.csvData.push({
          name: vm.projects[i].name,
          startDate: vm.projects[i].start_date,
          endDate: vm.projects[i].end_date,
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

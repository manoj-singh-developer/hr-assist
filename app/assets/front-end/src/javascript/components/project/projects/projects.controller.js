((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  function projectsCtrl($scope, $stateParams, $q, $rootScope, $mdDialog, $filter, tableSettings, autocompleteService, filterService, Project, Technology, Customer, Industry, AppType) {

    var vm = this;
    vm.showFilters = false;
    vm.tableSettings = tableSettings;
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
      vm.tableSettings.total = vm.projects.length;
    }

    function resetFilters() {
      angular.forEach(vm.filters, (item, key) => { vm.filters[key] = []; });
      filterProjects();
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        vm.tableSettings.total = autocompleteService.querySearch(query, list).length;
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
      });
    }

    function _buildAutocompleteLists() {
      autocompleteService.buildList(vm.projects, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name']);
      autocompleteService.buildList(vm.resources.industries, ['name']);
      autocompleteService.buildList(vm.resources.customers, ['name']);
      autocompleteService.buildList(vm.resources.application_types, ['name']);
    }

  }

})(_);

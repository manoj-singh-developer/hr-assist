((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl
    .$inject = ['$scope', '$stateParams', '$q', '$rootScope', '$mdDialog', 'autocompleteService', 'Project', 'Technology', 'Customer', 'Industry', 'AppType'];

  function projectsCtrl($scope, $stateParams, $q, $rootScope, $mdDialog, autocompleteService, Project, Technology, Customer, Industry, AppType) {

    var vm = this;
    vm.showFilters = false
    vm.resources = {};


    _getResources();


    vm.table = {
      options: {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
      },
      query: {
        order: 'name',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: []
    }

    vm.showForm = showForm;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;

    $rootScope.$on("event:projectResourcesLoaded", (event, data) => {
      vm.projects = data.projects;
      autocompleteService.buildList(vm.projects, ['name']);
    });

    $rootScope.$on('event:projectUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getProjects();
    });

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

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.projects);
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
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
        vm.resources.appTypes = data[4];

        $rootScope.$emit("event:projectResourcesLoaded", vm.resources);

      });
    }

  }

})(_);

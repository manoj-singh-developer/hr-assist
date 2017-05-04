((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'autocompleteService', 'Project'];

  function projectsCtrl($scope, $rootScope, $mdDialog, autocompleteService, Project) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.showFilters = false

    _getProjects();


    vm.showForm = showForm;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;

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

    function _getProjects() {
      Project.getAll().then((data) => {
        vm.projects = data;
        return autocompleteService.buildList(vm.projects, ['name']);
      });
    }

  }

})(_);

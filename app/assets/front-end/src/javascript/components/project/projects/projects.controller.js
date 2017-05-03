((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'Project'];

  function projectsCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Project) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.tableSettings = tableSettings;


    _getProjects();


    vm.showForm = showForm;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:deviceUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getProjects();
    });

    $rootScope.$on('event:deviceAdd', (event, data) => {
      vm.projects = vm.projects.concat(data);
    });

    function showForm(device) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/project/form/projectForm.view.html',
        controller: 'deviceFormCtrl',
        controllerAs: 'deviceForm',
        clickOutsideToClose: true,
        data: {
          device: angular.copy(device),
        }
      });
    }

    function remove(device, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + device.name + ' equipment?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Project.remove(device.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.projects, { id: device.id });
            vm.projects = _.without(vm.projects, toRemove);
          }
        });
      });
    }

    function multipleRemove() {}

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.projects);
    }


    function _getProjects() {
      Project.getAll().then((data) => {
        vm.projects = data;
        return autocompleteService.buildList(vm.projects, ['name']);
      });
    }

  }

})(_);

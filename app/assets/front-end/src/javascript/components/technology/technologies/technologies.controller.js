((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('technologiesCtrl', technologiesCtrl);

  technologiesCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'Technology'];

  function technologiesCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Technology) {

    var vm = this;
    vm.tableSettings = tableSettings;


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.multipleRemove = multipleRemove;


    _getSkills();


    $rootScope.$on('event:technologyUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getSkills();
    });

    $rootScope.$on('event:technologyAdd', (event, data) => {
      vm.technologies = vm.technologies.concat(data);
    });


    function showForm(technology) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/technology/form/technologyForm.view.html',
        controller: 'technologyFormCtrl',
        controllerAs: 'technologyForm',
        clickOutsideToClose: true,
        technology: angular.copy(technology)
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'skillJson.tmpl.html',
        controller: 'skillJsonM as skillM',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(technology, event) {
      var confirm = $mdDialog.confirm()
        .title('Remove the ' + technology.name + ' technology ?')
        .targetEvent(event)
        .cancel('No')
        .ok('Yes');

      $mdDialog.show(confirm).then(() => {
        Technology.remove(technology.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.technologies, { id: technology.id });
            vm.technologies = _.without(vm.technologies, toRemove);
          }
        });
      });
    }

    function multipleRemove() {
      // TODO: Implement this
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.technologies);
    }

    function _getSkills() {
      Technology.getAll().then((data) => {
        vm.technologies = data;
        return autocompleteService.buildList(vm.technologies, ['name']);
      });
    }

  }

})(_);

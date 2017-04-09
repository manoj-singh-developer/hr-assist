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


    vm.showFormCreate = showFormCreate;
    vm.showFormUpdate = showFormUpdate;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.querySearch = querySearch;
    vm.multipleRemove = multipleRemove;


    _getSkills();


    // TODO: Use proper naming for event
    // example: "event:technologyAdded"
    // example: "event:eventName"
    $rootScope.$on('newSkill', function(event, data) {
      vm.technologies.push(data);
    });

    $rootScope.$on('json', function(event, data) {
      for (var i = 0; i < data.length; i++) {
        vm.technologies.push(data[i]);
      }
    });

    $rootScope.$on('upSkill', function(event, data) {
      _getSkills();
      vm.tableSettings.selected = [];
    });


    function showFormCreate() {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/technology/views/technologyForm.view.html',
        controller: 'technologyFormCtrl',
        controllerAs: 'technologyForm',
        clickOutsideToClose: true,
        technology: {}
      });
    }

    function showFormUpdate(id) {
      let technology = vm.technologies.filter(function(item) {
        return item.id === id;
      })[0] || {};

      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/technology/views/technologyForm.view.html',
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

    function remove(technology, id, event) {
      event.stopPropagation();

      var confirm = $mdDialog.confirm()
        .title('Remove the ' + technology + ' technology ?')
        .targetEvent(event)
        .cancel('No')
        .ok('Yes');

      $mdDialog.show(confirm).then(() => {
        Technology.remove(id).then(() => {
          vm.technologies = _.without(vm.technologies, _.findWhere(vm.technologies, { id: id }));
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

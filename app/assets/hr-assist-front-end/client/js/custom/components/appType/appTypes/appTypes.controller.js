((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('appTypesCtrl', appTypesCtrl);

  appTypesCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'AppType'];

  function appTypesCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, AppType) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.appTypes = [];
    vm.tableSettings = tableSettings;


    _getAppTypes();


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:appTypeUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getAppTypes();
    });

    $rootScope.$on('event:appTypeAdd', (event, data) => {
      vm.appTypes = vm.appTypes.concat(data);
    });

    function showForm(appType) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/appType/form/appTypeForm.view.html',
        controller: 'appTypeFormCtrl',
        controllerAs: 'appTypeForm',
        clickOutsideToClose: true,
        data: {
          appType: angular.copy(appType),
        }
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + '/components/appType/views/appTypeFormJson.view.html',
        controller: 'appTypeFormJsonCtrl',
        controllerAs: 'appTypeFormJson',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(appType, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + appType.name + ' appType ?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        AppType.remove(appType.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.appTypes, { id: appType.id });
            vm.appTypes = _.without(vm.appTypes, toRemove);
          }
        });
      });
    }

    function multipleRemove() {}

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.appTypes);
    }

    function _getAppTypes() {
      AppType.getAll().then((data) => {
        vm.appTypes = data;
        return autocompleteService.buildList(vm.appTypes, ['name']);
      });
    }

  }

})(_);

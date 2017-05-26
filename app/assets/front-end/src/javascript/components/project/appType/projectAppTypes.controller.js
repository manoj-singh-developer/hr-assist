((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectAppTypesCtrl', projectAppTypesCtrl);

  function projectAppTypesCtrl(Project, $rootScope, AppType, autocompleteService) {

    let vm = this;
    let appTypesToAdd = [];
    let appTypesToRemove = [];
    vm.project = {};
    vm.appTypes = [];
    vm.prjAppTypes = [];
    vm.copyPrjAppTypes = [];
    vm.disableSaveBtn = true;
    vm.displayOrHide = false;

    _getAppTypes();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getPrjAppTypes();
    });

    vm.addInQueue = (appType) => {
      if (appType) {
        let notToAdd = _.findWhere(vm.copyPrjAppTypes, { id: appType.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(appTypesToRemove, { id: appType.id });
          appTypesToRemove = _.without(appTypesToRemove, toRemove);
          appTypesToAdd.push(appType);
          vm.copyPrjAppTypes.push(appType);
        }
        vm.searchText = ' ';
      }
      vm.disableSaveBtn = false;
    }

    vm.removeFromQueue = (appType) => {
      let toRemove = _.findWhere(vm.copyPrjAppTypes, { id: appType.id });
      vm.copyPrjAppTypes = _.without(vm.copyPrjAppTypes, toRemove);
      appTypesToAdd = _.without(appTypesToAdd, toRemove);
      appTypesToRemove.push(appType.id);
      vm.disableSaveBtn = false;
    }

    vm.cancel = () => {
      vm.searchText = "";
      vm.copyPrjAppTypes = [];
      Project.getAppTypes(vm.project)
        .then((data) => {
          vm.prjAppTypes = data;
          vm.copyPrjAppTypes.push(...vm.prjAppTypes);
        });
      vm.disableSaveBtn = true;
    }

    vm.save = () => {

      if (appTypesToAdd.length > 0) {
        Project.saveAppTypes(vm.project, appTypesToAdd);
        appTypesToAdd = [];
      }

      if (appTypesToRemove.length > 0) {
        Project.removeAppTypes(vm.project, appTypesToRemove);
        appTypesToRemove = [];
      }

      vm.displayOrHide = false;
      vm.disableSaveBtn = true;
      vm.searchText = "";
    }

    function _getAppTypes() {
      AppType.getAll()
        .then((data) => {
          vm.appTypes = data;
          autocompleteService.buildList(vm.appTypes, ['name']);
        });
    }

    function _getPrjAppTypes() {
      Project.getAppTypes(vm.project)
        .then((data) => {
          vm.prjAppTypes = data;
          vm.copyPrjAppTypes.push(...vm.prjAppTypes);
        });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

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
          _disableSaveBtn(false);
        }
        vm.searchText = ' ';
      }

    }

    vm.removeFromQueue = (appType) => {
      let toRemove = _.findWhere(vm.copyPrjAppTypes, { id: appType.id });
      vm.copyPrjAppTypes = _.without(vm.copyPrjAppTypes, toRemove);
      appTypesToAdd = _.without(appTypesToAdd, toRemove);
      appTypesToRemove.push(appType);
      _disableSaveBtn(false);
    }

    vm.save = () => {

      if (appTypesToAdd.length) {
        Project.saveAppTypes(vm.project, appTypesToAdd)
          .then(() => {
              appTypesToAdd = [];
            });
          }

      if (appTypesToRemove.length) {
        Project.removeAppTypes(vm.project, appTypesToRemove)
          .then(() => {
            appTypesToRemove = [];
          });
      }

      vm.toggleForm();
      _disableSaveBtn(true);
      vm.searchText = '';
    }

    vm.cancel = () => {
      vm.searchText = '';
      vm.copyPrjAppTypes = [];
      Project.getAppTypes(vm.project).then((data) => {
          vm.prjAppTypes = data;
          vm.copyPrjAppTypes.push(...vm.prjAppTypes);
        });
      _disableSaveBtn(true);
      vm.toggleForm();
    }

    vm.toggleForm = () => {
      vm.showForm = !vm.showForm;
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

    function _getAppTypes() {
      AppType.getAll().then((data) => {
          vm.appTypes = data;
          autocompleteService.buildList(vm.appTypes, ['name']);
        });
    }

    function _getPrjAppTypes() {
      Project.getAppTypes(vm.project).then((data) => {
          vm.prjAppTypes = data;
          vm.copyPrjAppTypes.push(...vm.prjAppTypes);
        });
    }

  }

})(_);

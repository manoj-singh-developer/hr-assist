((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectIndustriesCtrl', projectIndustriesCtrl);

  function projectIndustriesCtrl($rootScope, autocompleteService, Industry, Project) {

    let vm = this;
    let industriesToAdd = [];
    let industriesToRemove = [];
    vm.project = {};
    vm.industries = [];
    vm.prjIndustries = [];
    vm.copyPrjIndustries = [];
    vm.disableSaveBtn = true;

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;

    _getIndustries();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectIndustries();
    });

    function addInQueue(industry) {
      if (industry) {
        let notToAdd = _.findWhere(vm.copyPrjIndustries, { id: industry.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(industriesToRemove, { id: industry.id });
          industriesToRemove = _.without(industriesToRemove, toRemove);
          industriesToAdd.push(industry);
          vm.copyPrjIndustries.push(industry);
        }
        vm.searchText = ' ';
        _disableSaveBtn(false);
      }
    }

    function removeFromQueue(industry) {
      let toRemove = _.findWhere(vm.copyPrjIndustries, { id: industry.id });
      vm.copyPrjIndustries = _.without(vm.copyPrjIndustries, toRemove);
      industriesToAdd = _.without(industriesToAdd, toRemove);
      industriesToRemove.push(industry);
      _disableSaveBtn(false);
    }

    function save() {

      if (industriesToAdd.length) {
        Project.saveIndustries(vm.project, industriesToAdd)
          .then(() => {
            industriesToAdd = [];
          });
      }

      if (industriesToRemove.length) {
        Project.removeIndustries(vm.project, industriesToRemove)
          .then(() => {
            industriesToRemove = [];
          });
      }

      toggleForm();
      _disableSaveBtn(true);
      vm.searchText = '';
    }

    function cancel() {
      vm.searchText = '';
      vm.copyPrjIndustries = [];
      _getProjectIndustries();
      _disableSaveBtn(true);
      toggleForm();
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

    function _getIndustries() {
      Industry.getAll().then((data) => {
        vm.industries = data;
        autocompleteService.buildList(vm.industries, ['name']);
      });
    }

    function _getProjectIndustries() {
      Project.getIndustries(vm.project).then((data) => {
        vm.prjIndustries = data;
        vm.copyPrjIndustries.push(...vm.prjIndustries);
      });
    }

  }

})(_);

((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectIndustriesCtrl', projectIndustriesCtrl);

  projectIndustriesCtrl.$inject = ['$rootScope', 'autocompleteService', 'Industry', 'Project'];

  function projectIndustriesCtrl($rootScope, autocompleteService, Industry, Project) {

    let vm = this;
    let industrieToAdd = [];
    let industrieToRemove = [];
    vm.project = {};
    vm.industries = [];
    vm.prjIndustries = [];


    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.displayOrHide = false;

    _getIndustries();


    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectIndustries();
    });


    function addInQueue(technology) {
      if (technology) {
        let toRemove = _.findWhere(industrieToRemove, { id: technology.id });
        industrieToRemove = _.without(industrieToRemove, toRemove);
        industrieToAdd.push(technology);
        vm.prjIndustries.push(technology);
        vm.searchText = "";
      }
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.prjIndustries, { id: technology.id });
      vm.prjIndustries = _.without(vm.prjIndustries, toRemove);
      industrieToAdd = _.without(industrieToAdd, toRemove);
      industrieToRemove.push(technology);
      vm.searchText = "";
    }

    function save() {

      if (industrieToAdd.length) {
        Project.saveIndustries(vm.project, industrieToAdd)
          .then(() => {
            _getProjectIndustries();
  
          });
      }

      if (industrieToRemove.length) {
        Project.removeIndustries(vm.project, industrieToRemove)
          .then(() => {
            _getProjectIndustries();
          });
      }

      vm.displayOrHide = false;
    }

    function cancel() {
      vm.prjIndustries = [];
       Project.getIndustries(vm.project).then((data) => {
        vm.prjIndustries = data;
      });
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
      });
    }

    vm.showForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

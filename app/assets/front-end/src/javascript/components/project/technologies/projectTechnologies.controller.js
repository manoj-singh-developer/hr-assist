((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectTechnologiesCtrl', projectTechnologiesCtrl);

  function projectTechnologiesCtrl($rootScope, autocompleteService, Technology, Project) {

    let vm = this;
    let technologiesToAdd = [];
    let technologiesToRemove = [];
    vm.project = {};
    vm.technologies = [];
    vm.prjTechnologies = [];
    vm.copyPrjTechnologies = [];

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.disableSaveBtn = true;
    vm.displayOrHide = false;

    _getTechnologies();


    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectTechnologies();
    });

    function addInQueue(technology) {
      if (technology) {
        let notToAdd = _.findWhere(vm.copyPrjTechnologies, { id: technology.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
          technologiesToRemove = _.without(technologiesToRemove, toRemove);
          technologiesToAdd.push(technology);
          vm.copyPrjTechnologies.push(technology);
        }
        vm.searchText = ' ';
      }
      vm.disableSaveBtn = false;
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.copyPrjTechnologies, { id: technology.id });
      vm.copyPrjTechnologies = _.without(vm.copyPrjTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);
      vm.disableSaveBtn = false;
    }

    function save() {

      if (technologiesToAdd.length) {
        Project.saveTechnologies(vm.project, technologiesToAdd)
          .then(() => {
            technologiesToAdd = [];
          });
      }

      if (technologiesToRemove.length) {
        Project.removeTechnologies(vm.project, technologiesToRemove)
          .then(() => {
            technologiesToRemove = [];
          });
      }

      vm.displayOrHide = false;
      vm.disableSaveBtn = true;
      vm.searchText = '';
    }

    function cancel() {
      vm.searchText = '';
      vm.copyPrjTechnologies = [];
      Project.getTechnologies(vm.project).then((data) => {
        vm.prjTechnologies = data;
        vm.copyPrjTechnologies.push(...vm.prjTechnologies);
      });
      vm.disableSaveBtn = true;
    }


    function _getTechnologies() {
      Technology.getAll().then((data) => {
        vm.technologies = data;
        autocompleteService.buildList(vm.technologies, ['name']);
      });
    }

    function _getProjectTechnologies() {
      Project.getTechnologies(vm.project).then((data) => {
        vm.prjTechnologies = data;
        vm.copyPrjTechnologies.push(...vm.prjTechnologies);
      });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

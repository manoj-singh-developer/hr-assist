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
    vm.disableSaveBtn = true;

    _getTechnologies();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectTechnologies();
    });

    vm.addInQueue = (technology) => {
      if (technology) {
        let notToAdd = _.findWhere(vm.copyPrjTechnologies, { id: technology.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
          technologiesToRemove = _.without(technologiesToRemove, toRemove);
          technologiesToAdd.push(technology);
          vm.copyPrjTechnologies.push(technology);
        }
        vm.searchText = ' ';
        _disableSaveBtn(false);
      }

    }

    vm.removeFromQueue = (technology) => {
      let toRemove = _.findWhere(vm.copyPrjTechnologies, { id: technology.id });
      vm.copyPrjTechnologies = _.without(vm.copyPrjTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);
      _disableSaveBtn(false);
    }

    vm.save = () => {

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

      vm.toggleForm();
      _disableSaveBtn(true);
      vm.searchText = '';
    }

    vm.cancel = () => {
      vm.searchText = '';
      vm.copyPrjTechnologies = [];
      Project.getTechnologies(vm.project).then((data) => {
        vm.prjTechnologies = data;
        vm.copyPrjTechnologies.push(...vm.prjTechnologies);
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

  }

})(_);

((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectTechnologiesCtrl', projectTechnologiesCtrl);

  projectTechnologiesCtrl.$inject = ['$rootScope', 'autocompleteService', 'Technology', 'Project'];

  function projectTechnologiesCtrl($rootScope, autocompleteService, Technology, Project) {

    let vm = this;
    let technologiesToAdd = [];
    let technologiesToRemove = [];
    vm.project = {};
    vm.technologies = [];
    vm.prjTechnologies = [];

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.displayOrHide = false;

    _getTechnologies();


    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectTechnologies();
    });


    function addInQueue(technology) {
      if (technology) {
        let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
        technologiesToRemove = _.without(technologiesToRemove, toRemove);
        technologiesToAdd.push(technology);
        vm.prjTechnologies.push(technology);
        vm.searchText = "";
      }
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.prjTechnologies, { id: technology.id });
      vm.prjTechnologies = _.without(vm.prjTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);
      vm.searchText = "";
    }

    function save() {

      if (technologiesToAdd.length) {
        Project.saveTechnologies(vm.project, technologiesToAdd)
          .then(() => {
            _getProjectTechnologies();
          });
      }

      if (technologiesToRemove.length) {
        Project.removeTechnologies(vm.project, technologiesToRemove)
          .then(() => {
            _getProjectTechnologies();
          });
      }

      vm.displayOrHide = false;
    }

    function cancel() {
      vm.prjTechnologies = [];
      Project.getTechnologies(vm.project).then((data) => {
        vm.prjTechnologies = data;
      });
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
      });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

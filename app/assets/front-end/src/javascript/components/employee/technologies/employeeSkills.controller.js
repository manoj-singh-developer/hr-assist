((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeSkillsController', employeeSkillsController);

  employeeSkillsController
    .$inject = ['$rootScope', 'autocompleteService', 'User', 'Technology'];


  function employeeSkillsController($rootScope, autocompleteService, User, Technology) {

    let vm = this;
    let technologiesToAdd = [];
    let technologiesToRemove = [];
    vm.user = {};
    vm.technologies = [];
    vm.userTechnologies = [];
    vm.displayOrHide = false;

    vm.addNewTechnologie = addNewTechnologie;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.userTechnologies = data.userTechnologies.items;

      vm.technologies = data.technologies;
      autocompleteService.buildList(vm.technologies, ['name']);
    });

    function addNewTechnologie() {
      
      if (!vm.technologiesToAdd) {
        vm.technologiesToAdd = [];
      }
      vm.technologiesToAdd.push({});
    }

    function addInQueue(technology){
      if(technology){
        let toRemove = _.findWhere(technologiesToRemove, {id: technology.id});
        technologiesToRemove =_.without(technologiesToRemove, toRemove);
        technologiesToAdd.push(technology);
        vm.userTechnologies.push(technology);
        vm.searchText = "";

        User.updateTechnologies(data);

      }
    }

    function removeFromQueue(technology){
      let toRemove = _.findWhere(vm.userTechnologies, {id: technology.id});
      vm.userTechnologies = _.without(vm.userTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);

    }

    function saveTechnologies() {
      vm.displayOrHide = false;
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

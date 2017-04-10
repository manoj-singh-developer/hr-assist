((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectTechnologiesCtrl', projectTechnologiesCtrl);

  projectTechnologiesCtrl.$inject = ['$rootScope', 'autocompleteService', 'Technology', 'Project'];

  function projectTechnologiesCtrl($rootScope, autocompleteService, Technology, Project) {

    // 1. All technologies
    // 2. Technologies to be added/removed
    // 3. Specific project technologies in preview mode
    // 4. Specific project technologies in edit mode
    var vm = this;
    vm.project = {};
    vm.technologies = []; // [1]
    vm.technologiesTemp = []; // [2]
    vm.technologiesPreview = []; // [3]
    vm.technologiesEdit = []; // [4]


    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.remove = remove;


    _getTechnologies();


    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectTechnologies();
    });


    function addInQueue(technology) {
      vm.technologiesEdit.push(technology);
      vm.technologiesTemp.push(technology);
      vm.searchText = "";
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.technologiesPreview, { id: technology.id });
      vm.technologiesEdit = _.without(vm.technologiesEdit, toRemove);
      vm.technologiesTemp.push(technology);
      vm.searchText = "";
    }


    function save() {
      Project.saveTechnologies(vm.project, vm.technologiesTemp)
        .then((data) => {
          if (data) { vm.technologiesPreview = data; }
          vm.toggleForm();
        });
    }

    function remove(item, project, index) {
      vm.project.technologies.splice(index, 1);
    }


    function _getTechnologies() {
      Technology.getAll().then((data) => {
        vm.technologies = data;
        autocompleteService.buildList(vm.technologies, ['name']);
      });
    }

    function _getProjectTechnologies() {
      Project.getTechnologies(vm.project).then((data) => {
        vm.technologiesPreview = data;
      });
    }

  }

})(_);

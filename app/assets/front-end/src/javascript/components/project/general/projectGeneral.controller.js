(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectGeneralCtrl', projectGeneralCtrl);

  projectGeneralCtrl.$inject = ['$rootScope'];

  function projectGeneralCtrl($rootScope) {

    var vm = this;


    vm.saveProject = saveProject;
    vm.disabledgeneralInfo = true;
    vm.cancelAdd = cancelAdd;


    $rootScope.$on('projectIsLoadedEvent', function(event, project) {
      vm.project = project;
      vm.projectCpy = angular.copy(vm.project);
      vm.project.startDate = new Date(vm.project.startDate);
      vm.project.deadline = new Date(vm.project.deadline);
    });


    function saveProject(project) {
      $rootScope.$emit("callSaveMethodCardsProjects", project);
      vm.disabledgeneralInfo = true;
    }

    function cancelAdd() {
      vm.project.name = vm.projectCpy.name;
      vm.project.description = vm.projectCpy.description;
      vm.project.startDate = new Date(vm.projectCpy.startDate);
      vm.project.deadline = new Date(vm.projectCpy.deadline);
      vm.disabledgeneralInfo = true;
    }

  }

})();

(function () {

  'use strict';



  // hraSkillDetails directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraSkillDetailsBis', hraSkillDetailsBis);

  function hraSkillDetailsBis() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'skillDetailsController',
      controllerAs: 'skillDetails',
      templateUrl: rootTemplatePath + '/components/skill/views/skillDetails.view.html'
    };
  }



  // skillDetailsController controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('skillDetailsController', skillDetailsController);

  skillDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'skillModel', '$mdToast', 'ProjectModel'];

  function skillDetailsController($rootScope, $scope, $stateParams, skillModel, $mdToast, ProjectModel) {

    var vm = this;
    vm.viewLists = null;
    vm.viewObject = null;
    var ids = $stateParams.id;
    vm.employees = [];
    vm.candidates = [];
    vm.allProjects = [];
    vm.projects = [];

    // public methods
    // ------------------------------------------------------------------------
    vm.getSkills = getSkills;


    // public methods declaration
    // ------------------------------------------------------------------------



    // private methods declaration
    // ------------------------------------------------------------------------

    function getSkills() {
      skillModel.getAll().then(
        function (res) {
          vm.viewObject = res.filter(function (obj) {
            return obj.id == ids;
          });
          getProjects();
        },
        function (err) {
          $rootScope.showToast('Error on loading data! Please refresh!');
        });
    }

    function getProjects() {
      ProjectModel.getAll().then(
        function (data) {
          vm.allProjects = data;
          getStatistics();
        },
        function (data) {
          $rootScope.showToast('Holiday update failed!');
        });
    }

    function getStatistics() {
        if(vm.viewObject.length > 0)
            vm.employees = vm.viewObject[0];

        if(vm.viewObject.length > 0)
            vm.candidates = vm.viewObject[0];

        for(var i = 0; i < vm.allProjects.length; i++){
            for(var j = 0; j< vm.allProjects[i].technologies.length; j++)
                if(vm.allProjects[i].technologies[j] === vm.viewObject[0].label)
                    vm.projects.push(vm.allProjects[i].name);
        }
    }

    vm.getSkills();

  }
} ());
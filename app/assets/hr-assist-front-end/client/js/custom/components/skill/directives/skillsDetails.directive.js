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
    .$inject = ['$rootScope', '$scope', '$stateParams', 'skillModel', '$mdToast', 'ProjectModel', '$timeout'];

  function skillDetailsController($rootScope, $scope, $stateParams, skillModel, $mdToast, ProjectModel, $timeout) {

    var vm = this;
    vm.viewLists = null;
    vm.viewObject = null;
    var ids = $stateParams.id;
    vm.employees = [];
    vm.candidates = [];
    vm.allProjects = [];
    vm.projects = [];
    var technologies = [];

    // public methods
    // ------------------------------------------------------------------------
    vm.getSkills = getSkills;
    vm.getUsersProjectsSkills = getUsersProjectsSkills;

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

    function getUsersProjectsSkills() {
        var techArr = [];
        var id = $stateParams.id;
        var oneTech;
        $scope.employeeSameSkills = [];
        var projArr = [];
        $scope.projectSameSkills = [];

        skillModel.getOneSkill(id)
            .then(function (response){
                oneTech = response;
            })
            .catch(function (error){
                console.log(error);
            });

        skillModel.getUsers()
            .then(function (response){
                techArr = response;

                techArr.forEach(function (users, index) {
                    var usersTech = users.technologies;

                    usersTech.forEach(function (userT, index){
                        userT.name;
                        $timeout(function () {
                            if(oneTech.name !== undefined) {
                                if(oneTech.name === userT.name) {
                                    var firstName = users.first_name;
                                    var lastName = users.last_name;

                                    var skillsObj = {
                                        firstName: firstName,
                                        lastName: lastName
                                    };

                                    $scope.employeeSameSkills.push(skillsObj);
                                }
                            }

                            if($scope.employeeSameSkills.length > 0) {
                                $scope.showText = true;
                            } else {
                                $scope.showText = false;
                            }

                        }, 100);

                    })
                })
            })
            .catch(function (error){
                console.log(error);
            });

        ProjectModel.getProjectSkill()
            .then(function (response){
                projArr = response;

                projArr.forEach(function (proj, index){
                    var projTech = proj.technologies;

                    projTech.forEach(function (projT, index) {
                       projT.name;

                        $timeout(function () {
                            if(oneTech.name !== undefined) {
                                if (oneTech.name === projT.name) {

                                    var projectName = proj.name;
                                    var projectDesc = proj.desc;

                                    var projObj = {
                                        projectName: projectName,
                                        projectDesc: projectDesc
                                    };

                                    $scope.projectSameSkills.push(projObj)

                                }
                            }

                            if($scope.projectSameSkills.length > 0) {
                                $scope.showTextP = true;
                            } else {
                                $scope.showTextP = false;
                            }

                        });
                    })
                })
            })
            .catch(function (error){
                console.log(error)
            })
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
    vm.getUsersProjectsSkills();

  }
} ());
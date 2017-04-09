(function() {

  'use strict';


  // hraProjectDetails directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraProjectDetails', hraProjectDetails);

  function hraProjectDetails() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'projectDetailsController',
      controllerAs: 'projectDetails',
      templateUrl: rootTemplatePath + '/components/project/views/projectDetails.view.html'
    };
  }

  // projectDetailsController
  // --------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('projectDetailsController', projectDetailsController);

  projectDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'ProjectModel', 'Employee'];

  function projectDetailsController($rootScope, $scope, $stateParams, ProjectModel, Employee) {


    var vm = this;


    // Private methods declaration
    // ------------------------------------------------------------------------

    getProjectById($stateParams.id);

    function getProjectById(id) {
      ProjectModel.getProjectById(id).then(
        function(data) {
          vm.project = data;
          $rootScope.$emit("projectIsLoadedEvent", vm.project);
        },
        function(data) {});
    }

    var update = $rootScope.$on('callSaveMethodCardsProjects', function(event, project) {
      var project = angular.copy(project);
      if (!project.id) {

        var newProject = ProjectModel.create(project);
        ProjectModel.save(project).then(
          function(data) {
            $rootScope.showToast('Project ' + ' created successfuly!');
            onSaveSuccess('save', data);
            // vm.project = {};
            $mdDialog.cancel();
          },
          function(error) {
            $rootScope.showToast('Project ' + ' creation failed!');
            onSaveError(error);
          });
      } else {
        ProjectModel.update(project).then(
          function(data) {
            $rootScope.showToast('Project ' + ' updated successfuly!');

            onSaveSuccess('update', data);
          },
          function(error) {
            $rootScope.showToast('Project ' + ' update failed!');
            onSaveError();
          });
      }
    });

    $scope.$on('$destroy', function() {
      update();
    });


    function onSaveSuccess(action, project) {
      vm.btnIsDisabled = false;
      vm.serverErrors = false;
      $scope.projectform.$setUntouched();

      $rootScope.$broadcast('projectsListChanged', [action, project]);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

  }

}());

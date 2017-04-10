(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectDetailsCtrl', projectDetailsCtrl);

  projectDetailsCtrl
    .$inject = ['$rootScope', '$scope', '$stateParams', 'Project'];

  function projectDetailsCtrl($rootScope, $scope, $stateParams, Project) {


    var vm = this;

    getProjectById($stateParams.id);

    function getProjectById(id) {
      Project.getById(id).then(
        function(data) {
          vm.project = data;
          $rootScope.$emit("event:projectLoaded", vm.project);
        },
        function(data) {});
    }

    var update = $rootScope.$on('callSaveMethodCardsProjects', function(event, project) {
      var project = angular.copy(project);
      if (!project.id) {

        var newProject = Project.create(project);
        Project.save(project).then(
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
        Project.update(project).then(
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

})();

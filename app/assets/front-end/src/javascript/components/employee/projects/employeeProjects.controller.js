((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userProjectsCtrl', userProjectsCtrl);

  function userProjectsCtrl($rootScope, autocompleteService, $mdDialog, Project, User) {

    let vm = this;
    let projectsToAdd = [];
    let technologiesToRemove = [];
    let technologiesToAdd = [];
    vm.user = {};
    vm.projects = [];
    vm.userProjects = [];
    vm.technologies = [];
    vm.disableProjectName = false;
    vm.userTechnologies = [];
    vm.validateDate = false;
    vm.displayOrHide = false;
    vm.start_date = new Date();
    vm.end_date = new Date();

    vm.addProject = addProject;
    vm.addInQueue = addInQueue;
    vm.editProject = editProject;
    vm.save = save;
    vm.removeFromQueue = removeFromQueue;
    vm.clearInputs = clearInputs;
    vm.deleteProject = deleteProject;
    vm.checkDates = checkDates;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;
      vm.projects = data.projects;

      autocompleteService.buildList(vm.technologies, ['name']);
      autocompleteService.buildList(vm.projects, ['name']);
      _getUserProjects();
    });

    function editProject(project) {
      vm.searchText = project.project.name;

      vm.start_date = new Date(project.user_project_start_date);
      vm.end_date = new Date(project.user_project_end_date);

      projectsToAdd.push(project.project);
      vm.technologiesToAdd = project.technologies;
      vm.disableProjectName = true;
      vm.userTechnologies = project.technologies;
      vm.displayOrHide = true;
    }

    function addProject(project) {
      if (project) {
        projectsToAdd.push(project);
      }
    }

    function AddTechnology() {
      if (!vm.technologiesToAdd) {
        vm.technologiesToAdd = [];
      }
      vm.technologiesToAdd.push({});
    }

    function addInQueue(technology) {
      if (technology) {
        let notToAdd = _.findWhere(vm.userTechnologies, { id: technology.id });
        if (notToAdd === undefined) {
          let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
          technologiesToRemove = _.without(technologiesToRemove, toRemove);
          technologiesToAdd.push(technology.id);
          vm.userTechnologies.push(technology);
        }
        vm.searchTechnology = "";
      }
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.userTechnologies, { id: technology.id });
      vm.userTechnologies = _.without(vm.userTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);
    }

    function deleteProject(project, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + project.project.name + ' project?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        User.removeProjects(vm.user, project).then(() => {
          _getUserProjects()

        });
      });
    }

    function checkDates() {
      if (vm.start_date != undefined && vm.end_date != undefined && vm.start_date > vm.end_date) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }

    function save() {
      let projectId = [];
      let startDate = vm.start_date;
      let endDate = vm.end_date;

      for (let y = 0; y < projectsToAdd.length; y++) {
        projectId = projectsToAdd[y].id;
      }

      let projectObj = {
        start_date: startDate,
        end_date: endDate,
        project_id: projectId,
        user_id: vm.user.id,
        technology_ids: technologiesToAdd
      };

      User.updateProjects(vm.user, projectObj).then((data) => {
        _getUserProjects();
      });

      if (technologiesToRemove.length) {
        User.removeProjectTechnologies(projectObj, technologiesToRemove).then((data) => {
          _getUserProjects();
        });
        technologiesToRemove = [];
      }

      clearInputs();
      vm.displayOrHide = false;
    }

    function clearInputs() {
      vm.userTechnologies = [];
      projectsToAdd = [];
      vm.technologiesToAdd = [];
      technologiesToAdd = [];
      vm.searchText = '';
      vm.disableProjectName = false;
      vm.start_date = new Date();
      vm.end_date = new Date();
    }

    function _getUserProjects() {
      User.getProjects(vm.user).then((data) => {
        vm.userProjects = data;
      });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);

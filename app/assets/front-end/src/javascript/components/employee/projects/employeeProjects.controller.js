((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userProjectsCtrl', userProjectsCtrl);

  function userProjectsCtrl($rootScope, autocompleteService, $mdDialog, Project, User, dateService) {

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
    vm.showTechnologies = false;
    vm.minLength = 0;

    vm.dateService = dateService;
    vm.toggleForm = toggleForm;
    vm.editProject = editProject;
    vm.addProject = addProject;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.deleteProject = deleteProject;
    vm.checkDates = checkDates;
    vm.save = save;
    vm.cancel = cancel;
    vm.checkOnGoing = checkOnGoing;
    vm.changeMinLength = changeMinLength;
    vm.addTechnology = addTechnology;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;
      vm.projects = data.projects;

      autocompleteService.buildList(vm.technologies, ['name']);
      _getUserProjects();
    });

    function editProject(project) {
      vm.searchText = project.project.name;
      vm.start_date = project.user_project_start_date ? new Date(project.user_project_start_date) : undefined;
      vm.end_date = project.user_project_end_date ? new Date(project.user_project_end_date) : undefined;
      vm.onGoing = project.user_project_end_date ? undefined : true;

      projectsToAdd.push(project.project);
      vm.technologiesToAdd = project.technologies;
      vm.disableProjectName = true;
      vm.userTechnologies = project.technologies;
      toggleForm();
    }

    function addProject(project) {
      if (project) {
        projectsToAdd.push(project);
      }
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
        vm.searchTechnology = '';
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
          vm.userProjects = _.without(vm.userProjects, project);
        });
      });
    }

    function checkDates() {
      if (vm.onGoing) {
        vm.validateDate = false;
      } else {
        if (vm.start_date && vm.end_date && vm.start_date > vm.end_date) {
          vm.validateDate = true;
        } else {
          vm.validateDate = false;
        }
      }
    }

    function save() {
      let projectId = [];
      let startDate = vm.dateService.format(vm.start_date);
      let endDate = vm.end_date ? vm.dateService.format(vm.end_date) : null;

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
        User.removeProjectTechnologies(projectObj, technologiesToRemove);
      }

      cancel();
    }

    function cancel() {
      vm.userTechnologies = [];
      vm.technologiesToAdd = [];
      technologiesToRemove = [];
      projectsToAdd = [];
      technologiesToAdd = [];
      vm.minLength = 0;
      vm.searchText = '';
      vm.searchTechnology = '';
      vm.disableProjectName = false;
      vm.validateDate = false;
      vm.start_date = undefined;
      vm.end_date = undefined;
      vm.onGoing = undefined;
      vm.showTechnologies = false;
      toggleForm();
    }

    function addTechnology() {
      vm.showTechnologies = true;
    }

    function checkOnGoing() {
      vm.end_date = vm.onGoing ? null : vm.end_date;
      return vm.onGoing;
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function changeMinLength() {
      vm.minLength = 1;
    };

    function _getUserProjects() {
      User.getProjects(vm.user).then((data) => {
        vm.userProjects = data;

        vm.userProjects.forEach((element, index) => {
          let existingProject = _.findWhere(vm.projects, { id: element.project.id });
          vm.projects = _.without(vm.projects, existingProject);
        });

        autocompleteService.buildList(vm.projects, ['name']);
      });
    }

  }

})(_);

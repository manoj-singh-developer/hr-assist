((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userProjectsCtrl', userProjectsCtrl);

  userProjectsCtrl
    .$inject = ['$rootScope', 'autocompleteService', 'Project', 'User'];

  function userProjectsCtrl($rootScope, autocompleteService, Project, User) {

    let vm = this;
    let projectsToAdd = [];

    let technologiesToRemove = [];
    let technologiesToAdd = [];

    vm.user = {};
    vm.projects = [];
    vm.userProjects = [];
    vm.technologies = [];
    vm.currentProjectTechnologies = [];
    vm.disableProjectName = false;
    vm.userTechnologies = [];

    vm.addProject = addProject;
    vm.addInQueue = addInQueue;
    vm.editProject = editProject;
    vm.save = save;
    vm.removeFromQueue = removeFromQueue;
    vm.clearInputs = clearInputs;
    vm.deleteProject = deleteProject;
    _getProjects();


    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;
      autocompleteService.buildList(vm.technologies, ['name']);
      _getUserProjects();
    });

    function editProject(project) {
      let tech = project.technologies;
      vm.searchText = project.project.name;
      vm.technology = tech.map(tech => tech.name);

      vm.start_date = new Date(project.user_project_start_date);
      vm.end_date = new Date(project.user_project_end_date);

      projectsToAdd.push(project.project);
      vm.technologiesToAdd = project.technologies;
      vm.disableProjectName = true;
      vm.userTechnologies = project.technologies;

      vm.toggleForm();
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
        let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
        technologiesToRemove = _.without(technologiesToRemove, toRemove);
        technologiesToAdd.push(technology.id);
        vm.userTechnologies.push(technology);
        vm.technology = "";
      }
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.userTechnologies, { id: technology.id });
      vm.userTechnologies = _.without(vm.userTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);

    }

    function deleteProject(project) {
      User.removeProjects(vm.user, project).then(() => {
        _getUserProjects();
      });
    }

    function save() {

      let projectId = [];
      let startDate = _formatDate(vm.start_date);
      let endDate = _formatDate(vm.end_date);

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

      function _formatDate(date) {
        let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
      }
      vm.toggleForm();
      clearInputs();
    }

    function clearInputs() {
      vm.userTechnologies = [];
      projectsToAdd = [];
      vm.technologiesToAdd = [];
      technologiesToAdd = [];
      vm.searchText = '';
      vm.disableProjectName = false;
      vm.start_date,
        vm.end_date = new Date();
    }

    function _getProjects() {
      Project.getAll().then((data) => {
        vm.projects = data;
        autocompleteService.buildList(vm.projects, ['name']);
      });
    }

    function _getUserProjects() {
      User.getProjects(vm.user).then((data) => {
        vm.userProjects = data;
      });
    }

  }

})(_);

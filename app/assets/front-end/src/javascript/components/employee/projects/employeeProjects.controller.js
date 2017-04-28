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
    let projectsToRemove = [];

    let technologiesToRemove = [];
    let technologiesToAdd = [];

    vm.user = {};
    vm.projects = [];
    vm.userProjects = [];
    vm.technologies = [];
    vm.currentProjectTechnologies = [];
    vm.technologysToRemove = [];
    vm.disableProjectName = false;

    vm.addProject = addProject;
    vm.AddNewTechnology = AddNewTechnology;
    vm.addInQueueTechnology = addInQueueTechnology;
    vm.editProject = editProject;
    vm.save = save;
    vm.removeFromQueueTechnology = removeFromQueueTechnology;
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
      vm.toggleForm();
      vm.currentProjectTechnologies = project.technologies;
      vm.disableProjectName = true;
    }

    function addProject(project) {
      if (project) {
        projectsToAdd.push(project);
      }
    }

    function addInQueueTechnology(technology) {
      if (technology) {
        let toRemove = _.findWhere(technologiesToRemove, { id: technology.id });
        technologiesToRemove = _.without(technologiesToRemove, toRemove);
        technologiesToAdd.push(technology);

        for (var i = 0; i < vm.currentProjectTechnologies.length; i++) {
          let emptyObject = angular.equals(vm.currentProjectTechnologies[i], {});
          if (emptyObject) {
            vm.currentProjectTechnologies[i] = technology;
          }

        }
      }
    }

    function removeFromQueueTechnology(technology, index) {
      let toRemove = _.findWhere(vm.currentProjectTechnologies, { id: technology.id });
      vm.currentProjectTechnologies = _.without(vm.currentProjectTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);
      vm.technology[index]='';
    }

    function AddNewTechnology(newTechnology) {
      vm.currentProjectTechnologies.push({});
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
      let technologies = [];
      for (let y = 0; y < projectsToAdd.length; y++) {
        projectId = projectsToAdd[y].id;
      }

      for (let i = 0; i < vm.currentProjectTechnologies.length; i++) {
        technologies.push(vm.currentProjectTechnologies[i].id);
      }

      let projectToSave = {
        start_date: startDate,
        end_date: endDate,
        project_id: projectId,
        user_id: vm.user.id,
        technology_ids: technologies
      };

      if (projectsToAdd.length) {
        User.updateProjects(vm.user, projectToSave);
      }

      if (technologiesToRemove.length) {
        User.removeProjectTechnologies(projectToSave, technologiesToRemove);
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
      _getUserProjects();
      vm.toggleForm();
      clearInputs();
    }

    function clearInputs() {
      vm.currentProjectTechnologies = [];
      vm.searchText = '';
      vm.disableProjectName = false;
      vm.start_date,
        vm.end_date = new Date();
      vm.technology = [];
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

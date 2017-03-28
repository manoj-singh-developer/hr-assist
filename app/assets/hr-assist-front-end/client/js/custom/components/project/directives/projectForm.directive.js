(function() {

  'use strict';

  // hraProjectForm directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraProjectForm', hraProjectForm);

  function hraProjectForm() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        projects: '=',
        project: '=',
        projectIndex: '=',
        formTitle: '='
      },
      controller: 'projectFormCtrl as projectForm',
      controllerAs: 'projectForm',
      templateUrl: rootTemplatePath + '/components/project/views/projectForm.view.html',
    };
  }



  // projectFormController controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('projectFormCtrl', projectFormCtrl);

  projectFormCtrl
    .$inject = ['$rootScope', '$scope', '$http', '$mdToast', '$mdDialog', 'autocompleteService', 'miscellaneousService', 'ProjectModel', 'Employee', 'skillModel', 'Industries', 'customerModel', 'appType'];

  function projectFormCtrl($rootScope, $scope, $http, $mdToast, $mdDialog, autocompleteService, miscellaneousService, ProjectModel, Employee, skillModel, Industries, customerModel, appType) {

    var vm = this;
    vm.btnIsDisabled = false;
    vm.applicationTypes = [];
    vm.industries = [];

    // Convert string date to date instance
    vm.project.startDate = new Date(vm.project.startDate);
    vm.project.deadline = new Date(vm.project.deadline);

    vm.querySearch = querySearch;
    vm.addEmployee = addEmployee;
    vm.removeEmployee = removeEmployee;
    vm.addTechnology = addTechnology;
    vm.removeTechnology = removeTechnology;
    vm.addApp = addApp;
    vm.removeApp = removeApp;
    vm.addIndustry = addIndustry;
    vm.removeIndustry = removeIndustry;
    vm.addCustomer = addCustomer;
    vm.removeCustomer = removeCustomer;
    vm.saveProject = saveProject;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;
    vm.appSearch = appSearch;
    vm.industrySearch = industrySearch;
    vm.customerSearch = customerSearch;
    vm.technologySearch = technologySearch;
    vm.searchText = '';

    getEmployees();
    getIndustries();
    getCustomers();
    getTechnologies();



    // Public methods declaration
    // -----------------------------------------------------------------------

    function saveProject(project) {
      var project = angular.copy(project);
      vm.btnIsDisabled = true;

      if (!project.id) {

        var newProject = ProjectModel.create(project);

        ProjectModel.save(project).then(
          function(data) {
            $rootScope.showToast('Project created successfuly!');
            onSaveSuccess('save', data);
            // vm.project = {};
            $mdDialog.cancel();
          },
          function(error) {
            $rootScope.showToast('Project creation failed!');
            onSaveError(error);
          });
      } else {
        console.log(project);
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
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.employees);
    }

    function industrySearch(query) {
      return autocompleteService.querySearch(query, vm.industries);
    }

    function customerSearch(query) {
      return autocompleteService.querySearch(query, vm.customers);
    }

    function technologySearch(query) {
      return autocompleteService.querySearch(query, vm.skillList);
    }

    function addEmployee(item, project) {

      var employeeIndex = '';

      if (item) {
        employeeIndex = miscellaneousService.getItemIndex(vm.employees, item.id);
        vm.employees.splice(employeeIndex, 1);
        vm.project.employees.push(item);
        vm.searchText = "";
      }

      return;

    }

    function removeEmployee(item, project) {
      var employeeIndex = miscellaneousService.getItemIndex(vm.project.employees, item);
      vm.employees.unshift(vm.project.employees[employeeIndex]);
      vm.project.employees.splice(employeeIndex, 1);
    }

    function addTechnology(item, project) {
      var technologyIndex = '';

      if (item) {
        vm.project.technologies.push(item.label);
        vm.searchTech = "";
      }
      return;

    }

    function removeTechnology(item, project, index) {

      vm.project.technologies.splice(index, 1);
    }

    function addIndustry(index, item, project) {

      if (item) {
        vm.project.industries.push(item);
        vm.searchIndustry = "";
      }

      return;
    }

    function removeIndustry(item, project, index) {
      vm.project.industries.splice(index, 1);
    }

    function addCustomer(item, project) {

      var customerIndex = '';

      if (item) {

        vm.project.customers.push(item);
        vm.searchCustomer = "";
      }

      return;
    }

    function removeCustomer(item, project, index) {
      vm.project.customers.splice(index, 1);
    }

    function clearFields() {
      vm.project = {};
    };

    function closeDialog() {
      $mdDialog.cancel();
    };

    function getTechnologies() {
      skillModel.getAll().then(
        function(res) {
          vm.skillList = res;
          autocompleteService.buildList(vm.skillList, ['name']);
        },
        function(res) {
          $rootScope.showToast('Error on loading data! Please refresh!');
        });
    }

    function getEmployees() {
      Employee.getAll().then(
        function(data) {
          vm.employees = data;
          //  updateAutocompleteEmployees();
          autocompleteService.buildList(vm.employees, ['firstName', 'lastName']);

        },
        function(data) {});
    }

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

    function getIndustries() {
      Industries.getAllIndustries().then(function(data) {
        vm.industries = data;
        autocompleteService.buildList(vm.industries, ['name']);
      }, function(error) {});
    }

    function getCustomers() {
      customerModel.getAllCustomers().then(function(data) {
        vm.customers = data;
        autocompleteService.buildList(vm.customers, ['name']);
      }, function(error) {});
    }

    getAppData();
    vm.addApp = addApp;
    vm.removeApp = removeApp;

    function getAppData() {
      appType.getAll().then(
        function(data) {
          vm.applicationTypes = data;
        },
        function(data) {
          console.log("err", data);
        });
    }

    function appSearch(query) {
      return autocompleteService.querySearch(query, vm.applicationTypes);
    }

    function addApp(item, project) {

      if (item) {
        vm.project.applicationTypes.push(item);
        vm.searchApp = "";
      }

      return;

    }

    function removeApp(index, item, project) {
      vm.project.applicationTypes.splice(index, 1);
    }

  }

}());

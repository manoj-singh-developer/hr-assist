(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('hraJobsCtrl', hraJobsCtrl);

  hraJobsCtrl
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'Employee', 'Equipments', 'skillModel'];





  function hraJobsCtrl($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, Employee, Equipments, skillModel) {


    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var techIndex = 0;
    vm.serverErrors = false;
    vm.disabledJob = true;
    vm.createJob = [];
    vm.jobs = [];
    vm.acc = [];
    vm.copyCat = [];





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.saveEmployee = saveEmployee;
    vm.clearFields = clearFields;
    vm.cancelAdd = cancelAdd;
    vm.generalInfoShowHide = generalInfoShowHide;
    vm.addJobs = addJobs;
    vm.removeJob = removeJob;
    vm.querySearchTech = querySearchTech;
    vm.addTech = addTech;
    vm.addTechnology = addTechnology;
    vm.removeTechnology = removeTechnology;
    vm.toggleCard = toggleCard;





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      updateJobs();
    });

    $rootScope.$on('event:employeeResourcesLoaded', function(event, employeeResources) {
      setAllSkills(employeeResources.skills);
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function saveEmployee(employee) {
      fill(employee);
      vm.disabledJob = true;
      vm.copyCat = angular.copy(vm.createJob);
      $rootScope.$emit("callSaveMethodCards", employee);
    }

    function clearFields() {
      vm.employee = {};
    }

    function cancelAdd() {
      vm.disabledJob = true;
      for (var i = vm.copyCat.length; i < vm.createJob.length; i++) {
        vm.createJob[i] = "";
        vm.acc[i] = "";
      }
      vm.createJob = _.initial(vm.createJob, vm.createJob.length - vm.copyCat.length);
    }

    function updateJobs() {
      if (vm.employee.jobDetail !== null && vm.employee.jobDetail !== undefined && vm.employee.jobDetail !== '') {
        if (vm.employee.jobDetail.length > 0) {
          for (var j = 0; j < vm.employee.jobDetail.length; j++) {
            vm.createJob.push(angular.fromJson(vm.employee.jobDetail[j]));
          }
        } else if (vm.employee.jobDetail.length === 0) {
          return;
        } else {
          vm.createJob.push(angular.fromJson(vm.employee.jobDetail));
        }
        vm.copyCat = angular.copy(vm.createJob);
        for (var i = 0; i < vm.createJob.length; i++) {
          vm.createJob[i].name = vm.createJob[i] ? vm.createJob[i].name : '';
          vm.createJob[i].emplName = vm.createJob[i] ? vm.createJob[i].emplName : '';
          vm.createJob[i].startDate = vm.createJob[i] ? new Date(vm.createJob[i].startDate) : '';
          vm.createJob[i].endDate = vm.createJob[i] ? new Date(vm.createJob[i].endDate) : '';
          vm.createJob[i].description = vm.createJob[i] ? vm.createJob[i].description : '';
          vm.acc[i] = vm.createJob[i] ? vm.createJob[i].technologies : '';
        }
      }
    }

    function addJobs() {
      techIndex = 0;
      vm.createJob.push({});
      if (vm.createJob.length === 0) {
        vm.createJob.push([]);
      }
    }

    function removeJob(index) {
      vm.createJob.splice(index, 1);
    }

    function fill(employee) {
      vm.jobs = [];
      for (var j = 0; j < vm.createJob.length; j++) {
        vm.jobs.push({
          name: vm.createJob[j].name,
          emplName: vm.createJob[j].emplName,
          startDate: vm.createJob[j].startDate,
          endDate: vm.createJob[j].endDate,
          description: vm.createJob[j].description,
          technologies: vm.acc[j]
        });
      }

      vm.employee.jobDetail = angular.toJson(vm.jobs);
      vm.employee.equipments = vm.employee.equipments;

      employee = vm.employee;

      return employee;
    }

    function setAllSkills(skills) {
      vm.allSkills = skills;
      return autocompleteService.buildList(vm.allSkills, ['name']);
    }

    function querySearchTech(query) {
      return autocompleteService.querySearch(query, vm.allSkills);
    }

    function addTechnology(indP) {
      if (!vm.acc[indP]) {
        vm.acc[indP] = [];
        vm.acc[indP][techIndex] = "";
      } else {
        techIndex = vm.acc[indP].length;
        vm.acc[indP][techIndex] = "";
      }
    }

    function addTech(item, employee, index) {
      // console.log(item);
      techIndex = index;
      return;
    }

    function removeTechnology(jobIndex, index) {
      vm.acc[jobIndex].splice(index, 1);
    }

    function generalInfoShowHide(data) {
      if (data === 'job') {
        vm.disabledJob = false;
      }
    }

  }

})();

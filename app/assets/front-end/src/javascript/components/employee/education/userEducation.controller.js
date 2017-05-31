(function() {

  'use strict';

  angular
    .module('HRA')
    .controller('userEducationController', userEducationController);

  userEducationController

  function userEducationController($rootScope, $scope, $stateParams, User, autocompleteService, miscellaneousService, dateService) {

    var vm = this;
    vm.userEducationList = [];
    vm.userEducations = [];
    vm.showEditEducation = false;
    vm.validateDate = [];
    vm.validateDates = false;

    var getUser = $rootScope.$on('event:userResourcesLoaded', (event, data) => {
      vm.user = data.user;
      vm.userEducations = data.educations;
      initEducations();
    });

    vm.dateService = dateService;
    vm.removeEducation = removeEducation;
    vm.addNewEducation = addNewEducation;
    vm.save = save;
    vm.cancelAdd = cancelAdd;
    vm.displayEditEducation = displayEditEducation;
    vm.checkDates = checkDates;

    function displayEditEducation() {

      vm.showEditEducation = !vm.showEditEducation;
    }

    function addNewEducation() {
      vm.userEducationList.push({});
    }

    function removeEducation(index) {
      if (index < vm.userEducations.length) {
        let obj = { "education_ids": Array.of(vm.userEducations[index].id) };
        User.removeEducations(vm.user.id, obj);

        vm.userEducations.splice(index, 1);
        vm.userEducationList.splice(index, 1);
      } else {
        vm.userEducationList.splice(index, 1);
        vm.validateDate[index] = false;
      }
      checkDates();
    }

    function save() {
      var saveEducationsObj = {};
      var updateEducationsObj = {};
      saveEducationsObj["educations"] = [];
      updateEducationsObj["educations"] = [];

      vm.userEducationList.forEach(function(value, index) {
        value.start_date = vm.dateService.format(value.start_date);
        value.end_date = vm.dateService.format(value.end_date);
        if (index < vm.userEducations.length) {
          if (JSON.stringify(vm.userEducations[index]) !== JSON.stringify(value))
            updateEducationsObj["educations"].push(value);
        } else
          saveEducationsObj["educations"].push(value);
      });

      if (updateEducationsObj["educations"].length !== 0)
        User.updateEducations(vm.user.id, updateEducationsObj).then((data) => {
          vm.userEducations = data;
          initEducations();
        });

      if (saveEducationsObj["educations"].length !== 0)
        User.saveEducations(vm.user.id, saveEducationsObj).then((data) => {
        vm.userEducations = data;
        initEducations();
      });

    }

    function cancelAdd() {
      vm.userEducationList = [];
      vm.userEducationList = _.map(vm.userEducations, _.clone);
      vm.validateDate = [];
    }

    function initEducations() {
      vm.userEducationList = _.map(vm.userEducations, _.clone);
    }

    let startDate = [];
    let endDate = []
    vm.validateDate = [];

    function checkDates(index) {

      for (let i = 0; i < vm.userEducationList.length; i++) {
        startDate[i] = new Date(vm.userEducationList[i].start_date);
        endDate[i] = new Date(vm.userEducationList[i].end_date);
        if (startDate[i] != undefined && endDate[i] != undefined && startDate[i] > endDate[i]) {
          vm.validateDate[i] = true;
        } else {
          vm.validateDate[i] = false;
        }
      }
      if (vm.validateDate.indexOf(true) !== -1) {
        vm.validateDates = true;
      } else {
        vm.validateDates = false;
      }
    }

  }

}());

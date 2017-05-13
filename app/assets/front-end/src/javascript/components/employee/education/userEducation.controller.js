(function() {

  'use strict';

  angular
    .module('HRA')
    .controller('userEducationController', userEducationController);

  userEducationController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'User', 'autocompleteService', 'miscellaneousService'];

  function userEducationController($rootScope, $scope, $stateParams, User, autocompleteService, miscellaneousService) {

    var vm = this;
    vm.userEducationList = [];
    vm.userEducations = [];
    vm.showEditEducation = false;
    vm.validateDate = false;

    var getUser = $rootScope.$on('event:userResourcesLoaded', (event, data) => {
      vm.user = data.user;
      vm.userEducations = data.educations;
      initEducations();
    });

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
      } else
        vm.userEducationList.splice(index, 1);
    }

    function save() {

      var saveEducationsObj = {};
      var updateEducationsObj = {};
      saveEducationsObj["educations"] = [];
      updateEducationsObj["educations"] = [];

      vm.userEducationList.forEach(function(value, index) {
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
    }

    function initEducations() {
      vm.userEducationList = _.map(vm.userEducations, _.clone);
    }

    function checkDates(index) {
      if (vm.userEducationList[index].start_date != undefined && vm.userEducationList[index].end_date != undefined && vm.userEducationList[index].start_date > vm.userEducationList[index].end_date) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }
  }

}());

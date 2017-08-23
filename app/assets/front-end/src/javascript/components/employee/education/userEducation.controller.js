(function() {

  'use strict';

  angular
    .module('HRA')
    .controller('userEducationController', userEducationController);

  userEducationController

  function userEducationController($rootScope, $scope, $stateParams, User, autocompleteService, dateService, $mdDialog) {

    let vm = this;
    vm.userEducationList = [];
    vm.userEducations = [];
    vm.showForm = false;
    vm.validateDate = [];
    vm.validateDates = false;
    let startDate = [];
    let endDate = [];

    vm.dateService = dateService;
    vm.removeEducation = removeEducation;
    vm.addNewEducation = addNewEducation;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;
    vm.checkDates = checkDates;
    vm.checkOnGoing = checkOnGoing;

    $rootScope.$on('event:userResourcesLoaded', (event, data) => {
      vm.user = data.user;
      vm.userEducations = data.educations;
      _initEducations();
    });

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function addNewEducation() {
      vm.userEducationList.push({});
    }

    function removeEducation(index, event) {
      if (index < vm.userEducations.length) {
        let obj = { "education_ids": Array.of(vm.userEducations[index].id) };
        let confirm = $mdDialog.confirm()
          .title('Would you like to delete ' + vm.userEducations[index].degree + ' degree?')
          .targetEvent(event)
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(() => {
          User.removeEducations(vm.user.id, obj);
          vm.userEducations.splice(index, 1);
          vm.userEducationList.splice(index, 1);
          $rootScope.$emit('educationUpdated', vm.userEducations);
        });

      } else {
        vm.userEducationList.splice(index, 1);
        vm.validateDate[index] = false;
      }
    }

    function save() {
      let saveEducationsObj = {};
      let updateEducationsObj = {};
      saveEducationsObj["educations"] = [];
      updateEducationsObj["educations"] = [];

      vm.userEducationList.forEach(function(value, index) {
        value.start_date = vm.dateService.format(value.start_date);
        value.end_date = value.end_date ? vm.dateService.format(value.end_date) : null;

        if (index < vm.userEducations.length) {
          if (JSON.stringify(vm.userEducations[index]) !== JSON.stringify(value))
            updateEducationsObj["educations"].push(value);
        } else
          saveEducationsObj["educations"].push(value);
      });

      if (updateEducationsObj["educations"].length !== 0)
        User.updateEducations(vm.user.id, updateEducationsObj).then((data) => {
          vm.userEducations = data;
          $rootScope.$emit('educationUpdated', vm.userEducations);
          _initEducations();
        });

      if (saveEducationsObj["educations"].length !== 0)
        User.saveEducations(vm.user.id, saveEducationsObj).then((data) => {
          vm.userEducations = data;
          $rootScope.$emit('educationUpdated', vm.userEducations);
          _initEducations();
        });
      toggleForm();
    }

    function cancel() {
      vm.userEducationList = [];
      vm.userEducationList = _.map(vm.userEducations, _.clone);
      vm.validateDate = [];
      toggleForm();
    }

    function checkOnGoing(index) {
      vm.userEducationList[index].end_date = vm.userEducationList[index].onGoing ? null : vm.userEducationList[index].end_date;
      return vm.userEducationList[index].onGoing;
    }

    function checkDates(index) {

      vm.userEducationList.map((value, i) => {
        if (value.onGoing) {
          vm.validateDate[i] = false;
        } else {
          startDate[i] = new Date(vm.userEducationList[i].start_date);
          endDate[i] = new Date(vm.userEducationList[i].end_date);
          vm.validateDate[i] = startDate[i] && endDate[i] && startDate[i] > endDate[i] ? true : false;
        }
      });

      vm.validateDates = vm.validateDate.indexOf(true) !== -1 ? true : false;
    }

    function _initEducations() {
      vm.userEducationList = _.map(vm.userEducations, _.clone);
      vm.userEducationList.map((value, index) => {
        vm.userEducationList[index].onGoing = value.end_date ? false : true;
      });
    }

  }

}());

(function() {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeCourseController', employeeCourseController);

  function employeeCourseController($rootScope, $scope, $stateParams, User, autocompleteService, dateService, $mdDialog) {

    let vm = this;
    vm.userCertificationList = [];
    vm.userCertifications = [];
    vm.showForm = false;

    vm.dateService = dateService;
    vm.removeCourse = removeCourse;
    vm.addNewCourse = addNewCourse;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;

    $rootScope.$on('event:userResourcesLoaded', (event, data) => {
      vm.user = data.user;
      vm.userCertifications = data.certifications;
      _initEducations();
    });

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function addNewCourse() {
      vm.userCertificationList.push({});
    }

    function removeCourse(index, event) {
      if (index < vm.userCertifications.length) {
        let confirm = $mdDialog.confirm()
          .title('Would you like to delete ' + vm.userCertifications[index].name + ' degree?')
          .targetEvent(event)
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(() => {
          User.removeCertifications(vm.user.id, vm.userCertifications[index]);
          vm.userCertifications.splice(index, 1);
          vm.userCertificationList.splice(index, 1);
        });

      } else {
        vm.userCertificationList.splice(index, 1);
      }
    }

    function save() {
      let saveCourseObj = {};
      let updateCourseObj = {};
      saveCourseObj.certifications = [];
      updateCourseObj.certifications = [];

      vm.userCertificationList.forEach((value, index) => {
        value.year = value.year ? vm.dateService.format(value.year) : null;

        if (index < vm.userCertifications.length) {
          if (JSON.stringify(vm.userCertifications[index]) !== JSON.stringify(value))
            updateCourseObj.certifications.push(value);
        } else
          saveCourseObj.certifications.push(value);
      });

      if (updateCourseObj.certifications.length)
        User.updateCertifications(vm.user.id, updateCourseObj).then((data) => {
          vm.userCertifications = data;
          _initEducations();
        });

      if (saveCourseObj.certifications.length)
        User.saveCertifications(vm.user.id, saveCourseObj).then((data) => {
          vm.userCertifications = data;
          _initEducations();
        });
      toggleForm();
    }

    function cancel() {
      vm.userCertificationList = [];
      vm.userCertificationList = _.map(vm.userCertifications, _.clone);
      toggleForm();
    }

    function _initEducations() {
      vm.userCertificationList = _.map(vm.userCertifications, _.clone);
    }

  }

}());

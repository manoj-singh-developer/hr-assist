(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @hraEmployeeCvController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('hraEmployeeCvController', hraEmployeeCvController);

  hraEmployeeCvController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'Employee', '$window'];





  function hraEmployeeCvController($rootScope, $scope, $stateParams, Employee, $window) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.formTitle = 'Employee Profile';
    vm.employeeCvData = '';
    vm.createJob = [];
    vm.educationIncrement = [];
    vm.courseIncrement = [];
    vm.print = print;





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    getEmployeeById($stateParams.id, vm.candidate);





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function getEmployeeById(id, candidate) {
      Employee.getById(id, candidate).then(
        function(data) {
          vm.employeeCvData = data;
          transformJob(vm.employeeCvData.jobDetail);
          transformEducation(vm.employeeCvData.education);
          transformCourses(vm.employeeCvData.coursesAndCertifications);
        },
        function(data) {
          console.log(data);
        });
    }

    function transformJob(data) {
      if (data !== null && data !== undefined && data !== '') {
        if (data.length > 0) {
          for (var j = 0; j < data.length; j++) {
            vm.createJob.push(angular.fromJson(data[j]));
          }
        } else if (data.length === 0) {
          return;
        } else {
          vm.createJob.push(angular.fromJson(data));
        }
      }
    }

    function transformEducation(data) {
      if (data !== null && data !== undefined && data !== '') {
        if (data.length > 0) {
          for (var x = 0; x < data.length; x++) {
            vm.educationIncrement.push(angular.fromJson(data[x]));
          }
        } else if (data.length === 0) {
          return;
        } else {
          vm.educationIncrement.push(angular.fromJson(data));
        }
      }
    }

    function transformCourses(data) {

      if (data !== null && data !== undefined && data !== '') {
        if (data.length > 0) {
          for (var j = 0; j < data.length; j++) {
            vm.courseIncrement.push(angular.fromJson(data[j]));
          }
        } else if (data.length === 0) {
          return;
        } else {
          vm.courseIncrement.push(angular.fromJson(data));
        }
      }
    }

    function print(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" href="/styles/importer.css"><style>' +
        '#print-hide {display: none !important;}' +
        '.ng-hide { display: none !important; }' +
        '</style></head><body onload="window.print(); window.close();">' + printContents + '</body></html>');
      popupWin.document.close();
    }

  }

}());

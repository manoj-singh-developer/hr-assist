(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeUploadController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeUploadController', employeeUploadController);

  employeeUploadController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'Upload', '$timeout'];





  function employeeUploadController($rootScope, $scope, $stateParams, Upload, $timeout) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.disabledUpload = true;
    vm.showButton = false;
    vm.name = "";
    vm.showInput = false;
    vm.uploadedFile = [];
    vm.realNames = [];
    $scope.log = '';





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODSs
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      updateFiles();
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });





    // ----------------------------------------------------------------------
    // PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.changeView = changeView;
    vm.saveEmployee = saveEmployee;





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function changeView() {
      vm.disabledUpload = false;
    }

    function saveEmployee(employee) {
      fill(employee);
      vm.disabledUpload = true;
      $rootScope.$emit("callSaveMethodCards", employee);
      updateFiles();
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS
    // ----------------------------------------------------------------------

    function fill(employee) {
      vm.employee.fileNames = vm.realNames;
      vm.employee.files = vm.uploadedFile;
      employee.files = vm.employee.files;
      employee.fileNames = vm.employee.fileNames;
      employee = vm.employee;
      return employee;
    }

    function updateFiles() {
      if (vm.employee.files !== null && vm.employee.files !== undefined && vm.employee.files !== '') {
        for (var i = 0; i < vm.employee.files.length; i++) {
          vm.uploadedFile[i] = vm.employee.files[i] ? vm.employee.files[i] : '';
          vm.realNames[i] = vm.employee.fileNames[i] ? vm.employee.fileNames[i] : '';
        }
        vm.indexVal = vm.uploadedFile.length;
      }
    }

    $scope.upload = function(files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file) {
            Upload.upload({
              url: apiUrl + '/fileupload/upload',
              data: {
                uploadFile: file
              }
            }).then(function(resp) {
              $timeout(function() {
                vm.nr = 1 + vm.uploadedFile.length;
                for (var i = vm.uploadedFile.length; i < vm.nr; i++) {
                  vm.uploadedFile[i] = '/files/' + resp.data.file[0].fd.substr(resp.data.file[0].fd.lastIndexOf('/') + 1);
                }
                vm.showInput = true;
              });
            }, null, function(evt) {
              var progressPercentage = parseInt(100.0 *
                evt.loaded / evt.total);
              $scope.log = progressPercentage;
            });
          }
        }
      }
    };

    $scope.$watch('files', function() {
      $scope.upload($scope.files);
      if ($scope.files) {
        for (var i = 0; i < $scope.files.length; i++)
          if ($scope.files[i]) {
            vm.realNames.push($scope.files[i].name);
          }
      }
    });

    $scope.$watch('file', function() {
      if ($scope.file !== null) {
        $scope.files = [$scope.file];
      }
    });


  }

}());

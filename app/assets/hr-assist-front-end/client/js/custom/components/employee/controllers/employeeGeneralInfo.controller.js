(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('emplyeeGeneralInfoCtrl', emplyeeGeneralInfoCtrl);

  emplyeeGeneralInfoCtrl
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'Employee', '$location', 'apiUrl'];





  function emplyeeGeneralInfoCtrl($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, Employee, $location, apiUrl) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    var vm                  = this;
    vm.serverErrors         = false;
    vm.disabledgeneralInfo  = true;
    vm.teamLeader           = [];
    vm.employees            = [];
    /* beautify preserve:end */

    vm.contractType = [
      'Full-time',
      'Part-time 4h',
      'Part-time 6h'
    ];

    vm.employeeAssistPositionTitles = [
      'Junior iOS Developer',
      'Junior Java Developer',
      'Junior JavaScript Developer',
      'Junior Designer',
      'Junior Developer',
      'Junior Front End Developer',
      'Junior Mobile Developer',
      'Junior Tester',
      'Junior Web Developer',
      'Junior .Net Developer',
      'Junior Android Developer',
      'Junior Android Tester',
      'Junior Game Developer',
      'Junior Graphic Designer',
      'Junior Rails Developer',
      'Junior Web Developer',


      'Middle iOS Developer',
      'Middle Java Developer',
      'Middle JavaScript Developer',
      'Middle Designer',
      'Middle Developer',
      'Middle Front End Developer',
      'Middle Mobile Developer',
      'Middle Tester',
      'Middle Web Developer',
      'Middle .Net Developer',
      'Middle Android Developer',
      'Middle Android Tester',
      'Middle Game Developer',
      'Middle Graphic Designer',
      'Middle Rails Developer',
      'Middle Web Developer',

      'Senior iOS Developer',
      'Senior Java Developer',
      'Senior JavaScript Developer',
      'Senior Designer',
      'Senior Developer',
      'Senior Front End Developer',
      'Senior Mobile Developer',
      'Senior Tester',
      'Senior Web Developer',
      'Senior .Net Developer',
      'Senior Android Developer',
      'Senior Android Tester',
      'Senior Game Developer',
      'Senior Graphic Designer',
      'Senior Rails Developer',

      'Art Director',
      'Chief Executive Officer',
      'Chief Information Officer',
      'Chief Technology Officer',
      'Head of Cloud Engineering',
      'Head of Design',
      'Head of Development',
      'Head of Education',
      'Head of European Projects',
      'Head of Front End Development',
      'Head of Games',
      'Head of Health Development',
      'Head of Innovation',
      'Head of Microsoft Technologies',
      'Head of Mobile Development',
      'Head of Research',
      'Head of Testing',
      'Head of Web Development',
      'HR Manager',
    ];

    vm.candidatesPositionTitle = [
      'Javascript Developer',
      'Front End Engineer',
      'Java Developer',
      'QA Engineer',
      '3D Designer',
      'Software Engineer',
      'Android Developer',
      'C# Developer',
      'iOS Developer',
      'Other Positions',
      'Rejected'
    ];





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    vm.saveEmployee           = saveEmployee;
    vm.clearFields            = clearFields;
    vm.cancelAdd              = cancelAdd;
    vm.generalInfoShowHide    = generalInfoShowHide;
    vm.upload                 = upload;
    vm.emplSearch             = emplSearch;
    vm.selectedItemChange     = selectedItemChange;
    vm.getSelectedText        = getSelectedText;
    vm.removeYourTeam         = removeYourTeam;
    vm.toggleCard             = toggleCard;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee, candidate, progress) {
      vm.progress = progress;
      vm.employee = employee;
      vm.employee.officeTeamLider = vm.employee.officeTeamLider;
      vm.copyGeneralInfo = angular.copy(vm.employee);
      vm.copyCat = angular.copy(vm.employee);
      vm.name = vm.employee.firstName + ' ' + vm.employee.lastName;
      if (vm.employee.birthday !== null) {
        vm.employee.birthday = new Date(vm.employee.birthday);
      }

      if (vm.employee.assistStartDate !== null) {
        vm.employee.assistStartDate = new Date(vm.employee.assistStartDate);
      }
      vm.employee.languages = angular.toJson(vm.employee.languages);

    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });

    $rootScope.$on('event:updateProgress', function(event, progress) {
      vm.progress = progress;
    });

    // getEmployeAll();





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    vm.pId = $location.path().split("/")[2] || "Unknown"; //path will be /person/show/321/, and array looks like: ["","person","show","321",""]
    function saveEmployee(employee) {
      fill(employee);
      vm.copyCat = angular.copy(vm.employee);
      vm.disabledgeneralInfo = true;
      $rootScope.$emit("callSaveMethodCards", employee);
      vm.showSuccessMsg = false;
    }

    function clearFields() {
      vm.employee = {};
    }

    function cancelAdd() {
      vm.disabledgeneralInfo = true;
      vm.employee.urgentContact = vm.copyCat.urgentContact;
      vm.employee.address = vm.copyCat.address;
      vm.employee.firstName = vm.copyCat.firstName;
      vm.employee.lastName = vm.copyCat.lastName;
      vm.employee.middleName = vm.copyCat.middleName;
      vm.employee.phone = vm.copyCat.phone;
      vm.employee.emailOther = vm.copyCat.emailOther;
      vm.employee.carPlate = vm.copyCat.carPlate;
      vm.showSuccessMsg = false;
    }

    function upload(file) {
      if (file === null) {
        vm.showToLargeImage = true;
      }

      Upload.upload({
        url: apiUrl + '/fileupload/uploadPic',
        data: {
          uploadFile: file
        }
      }).then(function(resp) {
        if (resp.data.file.length === 1) {
          vm.showToLargeImage = false;
          vm.pictures = '/images/' + resp.data.file[0].fd.substr(resp.data.file[0].fd.lastIndexOf('/') + 1);
          vm.showSuccessMsg = true;
        }
      }, function(err) {
        $timeout(function() {
          vm.showErrMsg = true;
        }, 1000);
      }, function(evt) {
        var progressPercentage = parseInt(100.0 *
          evt.loaded / evt.total);
        $scope.log = progressPercentage;
      });
    }

    function emplSearch(query) {
      return autocompleteService.querySearch(query, vm.employees);
    }

    function selectedItemChange(item) {
      if (item !== undefined) {
        vm.teamLeader.push(item);
      }
    }

    function getSelectedText(item, contractOrposition) {
      if (item !== undefined && item !== null) {
        return item;
      } else {
        if (contractOrposition === 0) {
          return "Contract type...";
        } else {
          return "Position title...";
        }

      }
    }

    function removeYourTeam(item, index) {
      vm.teamLeader.splice(index, 1);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function fill(employee) {
      var pb = [];
      if (vm.employee.urgentContact !== null) {
        vm.employee.urgentContact = {
          "ContactName": vm.employee.urgentContact.ContactName,
          "ContactPhone": vm.employee.urgentContact.ContactPhone
        };
      }

      if (vm.employee.address !== null) {
        vm.employee.address = {
          "city": vm.employee.address.city,
          "zip": vm.employee.address.zip,
          "adresa": vm.employee.address.adresa
        };
      }

      vm.employee.equipments = vm.employee.equipments;
      vm.employee.picture = vm.pictures;
      vm.employee.officeTeamLider = vm.teamLeader;

      employee = vm.employee;
      return employee;
    }

    function updateTeamLider() {

      vm.teamLeader = vm.employees.filter(function(item) {
        return item.firstName + ' ' + item.lastName === vm.name;
      });
      for (var i in vm.teamLeader) {
        vm.teamLeader[i] = vm.teamLeader[i].firstName + ' ' + vm.teamLeader[i].lastName;
      }

    }

    function getEmployeAll() {
      Employee.getAll(vm.candidate).then(
        function(data) {
          vm.employees = data;
          updateTeamLider();
          vm.emplCopy = angular.copy(vm.employees);
          return autocompleteService.buildList(vm.employees, ['firstName', 'lastName']);
        },
        function(data) {});
    }

    function generalInfoShowHide(data) {
      if (data === 'general') {
        vm.disabledgeneralInfo = false;
      }
    }

  }

})();

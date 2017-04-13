(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('userGeneralInfoCtrl', userGeneralInfoCtrl);

  userGeneralInfoCtrl
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'User', 'Position', '$location', 'apiUrl'];





  function userGeneralInfoCtrl($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, User, Position, $location, apiUrl) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    var vm                  = this;
    vm.user = {};
    vm.userPosition = {};
    vm.userSchedule = {};
    
    vm.serverErrors         = false;
    vm.disabledgeneralInfo  = true;
    // vm.teamLeader           = [];
    // vm.users            = [];
    /* beautify preserve:end */
    vm.schedule = {};
    vm.contractType = [
      'Full-time',
      'Part-time 4h',
      'Part-time 6h'
    ];

    vm.userAssistPositionTitles = [];

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
    vm.save           = save;
    // vm.clearFields            = clearFields;
    vm.cancelAdd              = cancelAdd;
    vm.generalInfoShowHide    = generalInfoShowHide;
    // vm.upload                 = upload;
    // vm.emplSearch             = emplSearch;
    vm.selectedItemChange     = selectedItemChange;
    vm.getSelectedText        = getSelectedText;
    // vm.removeYourTeam         = removeYourTeam;
    // vm.toggleCard             = toggleCard;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getUser = $rootScope.$on('userIsLoadedEvent', function(event, user, candidate, progress) {
      vm.progress = progress;
      vm.user = user;
      // vm.user.officeTeamLider = vm.user.officeTeamLider;
      vm.copyUser = angular.copy(vm.user);

      // vm.name = vm.user.firstName + ' ' + vm.user.lastName;
      // if (vm.user.birthday !== null) {
      //   vm.user.birthday = new Date(vm.user.birthday);
      // }

      // if (vm.user.assistStartDate !== null) {
      //   vm.user.assistStartDate = new Date(vm.user.assistStartDate);
      // }
      // vm.user.languages = angular.toJson(vm.user.languages);
      _getUserPosition();
      _getUserSchedule();
    });

    $scope.$on('$destroy', function() {
      getUser();
    });

    $rootScope.$on('event:updateProgress', function(event, progress) {
      vm.progress = progress;
    });

    // getEmployeAll();



    _getPositions();

    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    // function toggleCard(event, action) {

    //   var card = angular
    //     .element(event.currentTarget)
    //     .closest('.js-user-card');

    //   $rootScope.$emit("event:toggleCard", card, action);

    // }


    // vm.pId = $location.path().split("/")[2] || "Unknown"; //path will be /person/show/321/, and array looks like: ["","person","show","321",""]
    // function saveEmployee(user) {
    //   fill(user);
    //   vm.copyCat = angular.copy(vm.user);
    //   vm.disabledgeneralInfo = true;
    //   $rootScope.$emit("callSaveMethodCards", user);
    //   vm.showSuccessMsg = false;
    //   Employee
    // }

    function save() {
      if(!(JSON.stringify(vm.copyUser) === JSON.stringify(vm.user)))
        User.update(vm.copyUser)
          .then((data) => {
            if (data) { vm.user = data }
            vm.toggleForm();
          });
      if(!(JSON.stringify(vm.copyUserSchedule) === JSON.stringify(vm.userSchedule)))
        User.updateSchedule(vm.copyUser.id, vm.copyUserSchedule)
          .then((data) => {
            if (data) { vm.userSchedule = data }
          });
      
      if(!(JSON.stringify(vm.copyUserPosition) === JSON.stringify(vm.userPosition)))
      {
        var position = {};
        angular.forEach(vm.positions, function(value, key){
          if(value.name === vm.copyUserPosition.name ){
            position["position_id"] = value.id;
          }

        })
        User.updatePosition(vm.copyUser.id,position)
          .then((data) => {
            if (data) { vm.userPosition = data }
          });
      }
        

        vm.disabledgeneralInfo = true;
    }

    // function clearFields() {
    //   vm.copyUserPosition = angular.copy(vm.userPosition);
    //   vm.copyUserSchedule = angular.copy(vm.userSchedule);
    //   vm.copyUser = angular.copy(vm.user);
    // }

    function cancelAdd() {
      vm.disabledgeneralInfo = true;
      vm.copyUserPosition = angular.copy(vm.userPosition);
      vm.copyUserSchedule = angular.copy(vm.userSchedule);
      vm.copyUser = angular.copy(vm.user);
      vm.showSuccessMsg = false;
    }

    // function upload(file) {
    //   if (file === null) {
    //     vm.showToLargeImage = true;
    //   }
    //   console.log(file);
    //   Upload.upload({
    //     url: apiUrl + '/fileupload/uploadPic',
    //     data: {
    //       uploadFile: file
    //     }
    //   }).then(function(resp) {
    //     if (resp.data.file.length === 1) {
    //       vm.showToLargeImage = false;
    //       vm.pictures = '/assets/images/' + resp.data.file[0].fd.substr(resp.data.file[0].fd.lastIndexOf('/') + 1);
    //       vm.showSuccessMsg = true;
    //     }
    //   }, function(err) {
    //     $timeout(function() {
    //       vm.showErrMsg = true;
    //     }, 1000);
    //   }, function(evt) {
    //     var progressPercentage = parseInt(100.0 *
    //       evt.loaded / evt.total);
    //     $scope.log = progressPercentage;
    //   });
    // }

    // function emplSearch(query) {
    //   return autocompleteService.querySearch(query, vm.users);
    // }

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

    // function removeYourTeam(item, index) {
    //   vm.teamLeader.splice(index, 1);
    // }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    // function fill(user) {
    //   var pb = [];
    //   if (vm.user.urgentContact !== null) {
    //     vm.user.urgentContact = {
    //       "ContactName": vm.user.urgentContact.ContactName,
    //       "ContactPhone": vm.user.urgentContact.ContactPhone
    //     };
    //   }

    //   if (vm.user.address !== null) {
    //     vm.user.address = {
    //       "city": vm.user.address.city,
    //       "zip": vm.user.address.zip,
    //       "adresa": vm.user.address.adresa
    //     };
    //   }

    //   vm.user.equipments = vm.user.equipments;
    //   vm.user.picture = vm.pictures;
    //   vm.user.officeTeamLider = vm.teamLeader;

    //   user = vm.user;
    //   return user;
    // }

    // function updateTeamLider() {

    //   vm.teamLeader = vm.users.filter(function(item) {
    //     return item.firstName + ' ' + item.lastName === vm.name;
    //   });
    //   for (var i in vm.teamLeader) {
    //     vm.teamLeader[i] = vm.teamLeader[i].firstName + ' ' + vm.teamLeader[i].lastName;
    //   }

    // }

    // function getEmployeAll() {
    //   Employee.getAll(vm.candidate).then(
    //     function(data) {
    //       vm.users = data;
    //       updateTeamLider();
    //       vm.emplCopy = angular.copy(vm.users);
    //       return autocompleteService.buildList(vm.users, ['firstName', 'lastName']);
    //     },
    //     function(data) {});
    // }

    function generalInfoShowHide(data) {
      if (data === 'general') {
        vm.disabledgeneralInfo = false;
      }
    }

    function _getUserPosition() {
      User.getPositionById(vm.user.id).then((data) => {
        vm.userPosition = data;
        vm.copyUserPosition = angular.copy(vm.userPosition);
      });
    }

    function _getUserSchedule() {
      User.getScheduleById(vm.user.id).then((data) => {
        vm.userSchedule = data;
        vm.copyUserSchedule = angular.copy(vm.userSchedule);
      });
    }

    function _getPositions() {
      Position.getAll().then((data) => {
        vm.positions = data;
        angular.forEach(vm.positions, function(value, key){
          vm.userAssistPositionTitles.push(value.name);
        });
      });
    }

  }

})();

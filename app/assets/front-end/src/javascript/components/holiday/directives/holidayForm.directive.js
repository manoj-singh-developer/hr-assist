(function() {

  'use strict';

  // hraHolidayForm directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraHolidayForm', hraHolidayForm);

  function hraHolidayForm() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        holiday: '=',
        holidayIndex: '=',
        formTitle: '='
      },
      controller: 'holidayFormController',
      controllerAs: 'holidayForm',
      templateUrl: rootTemplatePath + '/holiday/views/holidayForm.view.html',
    };
  }



  // holidayFormController controller
  //  Todo: Move Controller from directive! Make an separate file for each controller.
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('holidayFormController', holidayFormController);


  function holidayFormController($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, HolidayModel, User, $state, Project, errorService) {


    var vm = this;
    vm.serverErrors = false;
    vm.btnIsDisabled = false;
    vm.days = 0;
    vm.projList = [];
    vm.empList = [];
    vm.emps = [];
    vm.projs = [];
    vm.tba = [];
    vm.projadd = [];
    var replaced = [];
    vm.dateList = [];
    vm.projManager = [];
    vm.managerList = [];
    vm.today = new Date();
    vm.holidayIncrement = [{}];
    vm.holidaySend = []; //{teamLeader: "", replacement:{project: "", employee:""}}
    vm.holidayDateIncrement = [{}];
    vm.holidayReplaceIncrement = [{}];
    vm.holidayEmpIncrement = [{}];
    vm.allEmployees = [];
    vm.holidayLeader = [];
    vm.holidayRepProject = [];
    vm.holidayRepEmployee = [];
    vm.holidayDates = [];
    vm.searchProjectHold = [];
    vm.searchLeaderHold = [];
    vm.searchUser = [];
    vm.searchEmp = [];
    vm.user = [];
    vm.leader = [];
    vm.validateDate = false;

    // Public methods
    // ------------------------------------------------------------------------
    vm.saveHoliday = saveHoliday;
    vm.querySearch = querySearch;
    vm.querySearchProj = querySearchProj;
    vm.addProject = addProject;
    vm.removeProject = removeProject;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;
    vm.addEmployee = addEmployee;
    vm.removeEmployee = removeEmployee;
    vm.createPDF = createPDF;
    vm.changeHolidayView = changeHolidayView;
    vm.addNewHoliday = addNewHoliday;
    vm.addNewDateHoliday = addNewDateHoliday;
    vm.addNewReplaceHoliday = addNewReplaceHoliday;
    vm.addRepProject = addRepProject;
    vm.addRepEmployee = addRepEmployee;
    vm.print = print;
    vm.addUser = addUser;
    vm.checkDates = checkDates;


   function checkDates(index) {
     if (vm.dateList[index].signing_day != undefined && vm.dateList[index].from != undefined && vm.dateList[index].to != undefined && vm.dateList[index].signing_day >vm.dateList[index].from || vm.dateList[index].from >= vm.dateList[index].to) {
       vm.validateDate = true;
     } else {
       vm.validateDate = false;
     }
   }

    function print() {
      var printContents = document.getElementById('printable').innerHTML;
      var popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" href="/styles/importer.css"><style>' +
        '#print-hide {display: none !important;}' +
        '.ng-hide { display: none !important; }' +
        '</style></head><body onload="window.print(); window.close();">' + printContents + '</body></html>');
      popupWin.document.close();

    }

    function createPDF() {
      var specialElementHandlers = {
        '#editor': function(element, renderer) {
          return true;
        }
      };
      html2canvas(document.getElementById('printable'), {
        onrendered: function(canvas) {
          var data = canvas.toDataURL();
          var docDefinition = {
            content: [{
              image: data,
              width: canvas.width

            }]
          };
          pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
        }
      });

      // var doc = new jsPDF('p','pt','a4');
      // var source = popupWin;
      // doc.addHTML(source, function(){
      //   doc.save('concediu.pdf');
      // });
    }

    function saveHoliday(holiday) {

      var replacerArr = [];
      var repProjArr = [];

      for(var i = 0; i < vm.tba.length; i ++) {
          replacerArr.push(vm.tba[i].id);
      }

      for(var j = 0; j < vm.holidayRepProject.length; j ++){
          repProjArr.push(vm.holidayRepProject[j].id);
      }

      var user_id = vm.user[0].id;
      var day = datesCalculator();
      var start_date = vm.dateList[0].from;
      var end_date = vm.dateList[0].to;
      var signing_day = vm.dateList[0].signing_day;


      holiday = {
          user_id: user_id,
          days: day,
          start_date: start_date,
          end_date: end_date,
          replacer_ids: replacerArr,
          signing_day: signing_day,
          project_ids: repProjArr
      };

      saveHolidayToArr(holiday);

      var currentHoliday = angular.copy(holiday);
      vm.btnIsDisabled = true;

        if (!currentHoliday.id) {
          return HolidayModel.save(currentHoliday).then(
            function(data) {
              $rootScope.showToast('Holiday created successfuly!');
              $state.reload();
            },
            function(error) {
              $rootScope.showToast('Holiday creation failed!');
              errorService.forceLogout(error);
              onSaveError(error);
            });
        } else {
          return HolidayModel.update(currentHoliday).then(
            function(data) {
              $rootScope.showToast('Holiday updated successfuly!');
              HolidayModel.getHolidayById(currentHoliday.id).then(function(data) {
                onSaveSuccess('update', data);
                  $mdDialog.cancel();
                },
                function() {});

            },
            function(error) {
              errorService.forceLogout(error);
              $rootScope.showToast('Holiday update failed!');
              onSaveError();
            });
        }
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.empList);
    }

    function querySearchProj(query) {
      return autocompleteService.querySearch(query, vm.projList);
    }

    function addEmployee(item, holiday) {

      var employeeIndex = '';
      if (item) {
        employeeIndex = miscellaneousService.getItemIndex(vm.empList, item.id);
        vm.empList.splice(employeeIndex, 1);
        vm.tba.push(item);
      } else {
        return;
      }
    }

    function addUser(item, holiday, index) {

      var userIndex = '';
      if (item) {
        userIndex = miscellaneousService.getItemIndex(vm.empList, item.id);
        vm.empList.splice(userIndex, 1);
        vm.user[0] = item;
      } else {
        return;
      }
    }

    function removeEmployee(item, holiday) {
      var employeeIndex = miscellaneousService.getItemIndex(vm.tba, item.id);
      vm.empList.push(vm.tba[employeeIndex]);
      vm.tba.splice(employeeIndex, 1);
    }

    function addProject(item, holiday) {
      var projectIndex = '';
      if (item) {
        projectIndex = miscellaneousService.getItemIndex(vm.projList, item.id);
        vm.projList.splice(projectIndex, 1);
        vm.projadd.push(item);
        vm.holiday.replacement.project = "";
      } else {
        return;
      }
    }

    function removeProject(item, holiday) {
      var projectIndex = miscellaneousService.getItemIndex(vm.projadd, item.id);
      vm.projList.push(vm.projadd[projectIndex]);
      vm.projadd.splice(projectIndex, 1);
    }

    function clearFields() {
      vm.holiday = {};
      vm.user=[];
      vm.dateList=[];
      vm.holidayDateIncrement = [{}];
      vm.holidayReplaceIncrement = [{}];
      vm.holidayEmpIncrement = [{}];
      vm.holidayRepProject = [];
      vm.holidayRepEmployee = [];
      vm.holidayDates = [];
      vm.searchProjectHold = [];
      vm.searchLeaderHold = [];
      vm.searchUser = [];
      vm.searchEmp = [];
    }

    function closeDialog() {
      $mdDialog.cancel();
    }



    // Private methods declaration
    // ------------------------------------------------------------------------
    getEmployees();
    getProjects();
    //projectManagerList();

    function fillList() {
      for (var i = 0; i < vm.tba.length; i++) {
        replaced.push({
          project: vm.projadd[i],
          employee: vm.tba[i]
        });
      }
    }

    function projectManagerList() {
      vm.projManager = vm.managerList.filter(function(elem, index, array) {
        return array.indexOf(elem) === index;
      });
    }

    function datesCalculator() {

      var oneDay = 24 * 60 * 60 * 1000;
      var diffDays = 0;
      var firstDate = new Date();
      var secondDate = new Date();
      if (!vm.dateList[1]) {
        firstDate = new Date(vm.dateList[0].from);
        secondDate = new Date(vm.dateList[0].to);

        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
      } else {
        firstDate = new Date(vm.dateList[0].from);
        secondDate = new Date(vm.dateList[0].to);
        var thirdDate = new Date(vm.dateList[1].from);
        var fourthDate = new Date(vm.dateList[1].to);

        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        diffDays += Math.round(Math.abs((thirdDate.getTime() - fourthDate.getTime()) / (oneDay)));
      }
      return diffDays;
    }


    function getEmployees() {
      User.getAll().then(
        function(data) {
          vm.empList = data;
          updateUser();
          updateTeamLeader();
          return autocompleteService.buildList(vm.empList, ['first_name', 'last_name']);
        },
        function(data) {
          $rootScope.showToast('Holiday update failed!');
        })
        .catch((error) => {
          errorService.forceLogout(error);
        })
    }



    function getProjects() {
        Project.getAll().then(
        function(data) {
          vm.projList = data;
          for (var i = 0; i < vm.projList.length; i++) {
            vm.projs.push(vm.projList[i]);
            vm.managerList.push(vm.projList[i].manager);
          }
          updateProject();
          updateDates();
          vm.projManager = vm.managerList.filter(function(elem, index, array) {
            return array.indexOf(elem) === index;
          });
          return autocompleteService.buildList(vm.projList, ['name']);
        },
        function(data) {
          $rootScope.showToast('Holiday update failed!');
        })
          .catch((error) => {
            errorService.forceLogout(error);
          })
    }

    function onSaveSuccess(action, holiday) {
      vm.btnIsDisabled = false;
      vm.serverErrors = false;
      $rootScope.$broadcast('holidaysListChanged', [action, holiday]);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

    //remake

    function changeHolidayView() {
      vm.holidayInfo = false;
    }

    function addNewDateHoliday() {
      vm.holidayDateIncrement.push({});
    }

    function addNewReplaceHoliday() {
      vm.holidayReplaceIncrement.push({});
    }

    function addNewHoliday() {
      vm.holidayIncrement.push({});
    }

    function addRepProject(item, employee, index) {
      vm.holidayRepProject[index] = item;
    }

    function addRepEmployee(item, employee, index) {
      vm.holidayRepEmployee[index] = item;
    }

    function saveHolidayToArr(holiday) {

      var sign = new Date();
      var idx = holiday.id;

      var user_id = vm.user[0].id;
      var day = datesCalculator();


        for (var i = 0; i < vm.holidayRepProject.length; i++)
        replaced.push({
          project: vm.holidayRepProject[i],
          employee: vm.holidayRepEmployee[i]
        });
      vm.holidaySend = {
        user_id: user_id,
        days: day,
        signingDate: sign,
        id: idx
      };
    }

    function updateProject() {
      if (vm.holiday.replacement !== null && vm.holiday.replacement !== undefined) {
        vm.holidayReplaceIncrement = vm.holiday.replacement;
        for (var i = 0; i < vm.holiday.replacement.length; i++) {
          vm.searchProjectHold[i] = vm.holiday.replacement[i].project ? vm.holiday.replacement[i].project.name : '';
          vm.holidayRepProject[i] = vm.holiday.replacement[i].project ? vm.holiday.replacement[i].project : '';
          vm.searchRepEmpHold[i] = vm.holiday.replacement[i].employee ? vm.holiday.replacement[i].employee.firstName + " " + vm.holiday.replacement[i].employee.lastName : '';
          vm.holidayRepEmployee[i] = vm.holiday.replacement[i].employee ? vm.holiday.replacement[i].employee : '';
        }
      }
    }

    function updateTeamLeader() {
      if (vm.holiday.teamLeader !== null && vm.holiday.teamLeader !== undefined) {
        vm.holidayLeader = vm.holiday.teamLeader;
        for (var i = 0; i < vm.holidayLeader.length; i++)
          vm.searchLeaderHold[i] = vm.holiday.teamLeader[i] ? (vm.holiday.teamLeader[i].firstName + " " + vm.holiday.teamLeader[i].lastName) : '';
      }
    }

    function updateUser() {
      if (vm.holiday.employee !== null && vm.holiday.employee !== undefined) {
        vm.user = vm.holiday.employee;
        vm.holidayEmpIncrement = vm.user;
        vm.searchUser[0] = vm.user[0] ? (vm.user[0].firstName + " " + vm.user[0].lastName) : '';
        vm.searchEmp = vm.user[0] ? (vm.user[0].id) : '';
      }
    }

    function updateDates() {
      if (vm.holiday.period !== null && vm.holiday.period !== undefined) {
        vm.holidayDateIncrement = vm.holiday.period;
        for (var i = 0; i < vm.holiday.period.length; i++)
          vm.dateList[i] = vm.holiday.period[i] ? ({
            from: new Date(vm.holiday.period[i].from),
            to: new Date(vm.holiday.period[i].to)
          }) : '';
      }
    }

      //end remake


    // IDEAS FOR FUTURE HERE:  :)



    // /*
    // TO DO:
    // HARD REFACTORY FOR FILE UPLOAD
    // WORSK BUT NOT NEEDED AT THE MOMENT
    // */
    // $scope.$watch('files', function() {
    //   $scope.upload($scope.files);
    // });

    // $scope.$watch('file', function() {
    //   if ($scope.file !== null) {
    //     $scope.files = [$scope.file];
    //   }
    // });

    // $scope.log = 0;

    // $scope.upload = function(files) {
    //   if (files && files.length && files[0] !== undefined) {
    //     for (var i = 0; i < files.length; i++) {
    //       var file = files[i];
    //       if (!file.$error) {
    //         Upload.upload({
    //           url: apiUrl + '/fileupload/upload',
    //           data: {
    //             uploadFile: file
    //           }
    //         }).then(function(resp) {
    //           $timeout(function() {
    //             vm.employee.picture = '/assets/images/' + resp.data.file[0].fd.substr(resp.data.file[0].fd.lastIndexOf('/') + 1);
    //           });
    //         }, null, function(evt) {
    //           var progressPercentage = parseInt(100.0 *
    //             evt.loaded / evt.total);
    //           $scope.log = progressPercentage;
    //         });
    //       }
    //     }
    //   }
    // };


  }

}());

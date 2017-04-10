(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeFormCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeFormController', employeeFormController);

  employeeFormController
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'Employee', 'Equipments', 'Callback', 'skillModel'];





  function employeeFormController($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, Employee, Equipments, Callback, skillModel) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.serverErrors = false;
    vm.btnIsDisabled = false;
    vm.equipmentNr = [];
    vm.minus = [];
    vm.employee.schedule = {
      "monday": ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 12:30", "12:30 - 13:30 (lunch)", "13:30 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
      "tuesday": ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 12:30", "12:30 - 13:30 (lunch)", "13:30 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
      "wednesday": ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 12:30", "12:30 - 13:30 (lunch)", "13:30 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
      "thursday": ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 12:30", "12:30 - 13:30 (lunch)", "13:30 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
      "friday": ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 12:30", "12:30 - 13:30 (lunch)", "13:30 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"]
    };





    // ----------------------------------------------------------------------
    // PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.saveEmployee = saveEmployee;
    vm.querySearch = querySearch;
    vm.addSkill = addSkill;
    vm.removeSkill = removeSkill;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;
    vm.querySearchEquipments = querySearchEquipments;
    vm.addEquipments = addEquipments;
    vm.searchTextChange = searchTextChange;
    vm.removeEq = removeEq;



    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    // getSkills();
    // getEquipments();





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function saveEmployee(employee) {
      var currentEmployee = angular.copy(employee);
      vm.generalInfo = true;
      vm.btnIsDisabled = true;
      if (!employee.id) {
        var newEmployee = Employee.create(currentEmployee);

        return Employee.save(currentEmployee, vm.candidate).then(
          function(data) {

            $rootScope.showToast('Employee created successfuly!');
            addUsedEquipment();
            Employee.getById(data.id, vm.candidate).then(function(data) {
              onSaveSuccess('save', Employee.create(data));
            }, function() {
              // De facut si la eroare
            });

            vm.employee = {};
            addUsedEquipment();
          },
          function(error) {
            $rootScope.showToast('Employee creation failed!');
            onSaveError(error);
          });
      } else {
        return Employee.update(currentEmployee, vm.candidate).then(
          function(data) {
            $rootScope.showToast('Employee updated successfuly!');
            addUsedEquipment();
            Employee.getById(currentEmployee.id, vm.candidate).then(function(data) {
              onSaveSuccess('update', data);

            }, function() {

              // De facut si la eroare
            });
          },
          function(error) {
            $rootScope.showToast('Employee update failed!');
            onSaveError();
          });
      }
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.allSkills);
    }

    function addSkill(item, employee) {
      var skillIndex = '';

      if (item) {
        skillIndex = miscellaneousService.getItemIndex(vm.allSkills, item.id);
        vm.allSkills.splice(skillIndex, 1);
        employee.skills.push(item);
        vm.searchText = "";
      } else {
        return;
      }
    }

    function removeSkill(item, employee) {
      var skillIndex = miscellaneousService.getItemIndex(employee.skills, item.id);
      vm.allSkills.push(employee.skills[skillIndex]);
      employee.skills.splice(skillIndex, 1);
    }

    function clearFields() {
      vm.employee = {};
    }

    function closeDialog() {
      $mdDialog.cancel();
    }

    function querySearchEquipments(query) {
      return autocompleteService.querySearch(query, vm.equipmentsList);
    }

    function addEquipments(item, employee, nr, model) {
      var eqIndex = '';
      if (item) {
        if (item.used === item.total) {
          Callback.error("This equipment is out of stock");
        } else {
          eqIndex = miscellaneousService.getItemIndex(vm.equipmentsList, item.id);
          vm.equipmentsList.splice(eqIndex, 1);
          employee.equipments.push(item);
          vm.equipmentNr.push({
            "nr": nr,
            "id": item.id,
            "used": item.used,
            "total": item.total,
            "name": item.name
          });
        }
      } else {
        return;
      }
    }

    function searchTextChange(index) {
      for (var i = 0; i < vm.equipmentNr.length; i++) {
        if (index === vm.equipmentNr[i].nr) {
          vm.equipmentNr.splice(i, 1);
          vm.employee.equipments.splice(i, 1);
        }
      }
    }

    function addUsedEquipment() {
      var data = {
        "id": "",
        "used": ""
      };
      var dataminus = {
        "id": "",
        "used": ""
      };
      for (var i = 0; i < vm.equipmentNr.length; i++) {
        if (vm.equipmentNr[i].total === vm.equipmentNr[i].used) {
          Callback.error()
        } else {
          data = {
            "id": vm.equipmentNr[i].id,
            "used": vm.equipmentNr[i].used + 1
          };
          Equipments.update(data)
            .then(function(res) {
              $mdDialog.cancel();
              $rootScope.$emit('eqReplace', res);
            }, function(err) {
              Callback.error();
            });
        }
      }
      if (vm.minus.length != 0) {
        for (var i = 0; i < vm.minus.length; i++) {
          dataminus = {
            "id": vm.minus[i].id,
            "used": vm.minus[i].used - 1
          };
          Equipments.update(dataminus)
            .then(function(res) {
              $mdDialog.cancel();
              $rootScope.$emit('eqReplace', res);
            }, function(err) {
              Callback.error();
            });
        }
      }
    }

    function removeEq(index, equipment) {
      vm.minus.push(equipment);
      vm.employee.equipments.splice(index, 1);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ------------------------------------------------------------------------

    function getSkills() {
      skillModel.getAll().then(function(data) {
        vm.allSkills = data;
        updateAutocompleteSkills(vm.allSkills);
        return autocompleteService.buildList(vm.allSkills, ['name']);
      }, function(err) {});
    }

    function updateAutocompleteSkills(allSkills) {
      var index = 0;
      var indexSkillToRemove = '';

      for (index; index < vm.employee.skills.length; index++) {
        indexSkillToRemove = miscellaneousService
          .getItemIndex(allSkills, vm.employee.skills[index].id);
        allSkills.splice(indexSkillToRemove, 1);
      }
    }

    function onSaveSuccess(action, employee) {
      vm.btnIsDisabled = false;
      vm.serverErrors = false;
      $scope.employeeform.$setUntouched();
      $rootScope.$broadcast('employeesListChanged', [action, employee]);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

    function getEquipments() {
      Equipments.list()
        .then(function(res) {
          vm.equipmentsList = res;
          return autocompleteService.buildList(vm.equipmentsList, ['name', 'description']);
        }, function(err) {
          Callback.error();
        });
    }

  }

}());

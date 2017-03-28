(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeesCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeesCtrl', employeesCtrl);

  employeesCtrl
    .$inject = ['$rootScope', '$scope', '$mdDialog', 'autocompleteService', 'miscellaneousService', 'skillModel', 'Employee', 'ProjectModel', '$templateCache'];





  function employeesCtrl($rootScope, $scope, $mdDialog, autocompleteService, miscellaneousService, skillModel, Employee, ProjectModel, $templateCache) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var final = [];
    var date = new Date();
    var filtru = [];
    vm.reset = reset;
    vm.ids = [];
    vm.monthsList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    vm.positionTitles = [
      "Senior Developer",
      "Middle Developer",
      "Junior Developer",
      "Head of Front-end Development",
      "Head of Education",
      "Head of Microsoft Technologies",
      "Project Manager",
      "Head of QA & Testing"
    ];
    vm.candidatesPositionTitle = [
      "Javascript Developer",
      "Front End Engineer",
      "Java Developer",
      "QA Engineer",
      "3D Designer",
      "Software Engineer",
      "Android Developer",
      "C# Developer",
      "iOS Developer",
      "Other Positions"
    ];
    vm.searchBySkills = false;
    vm.emplCopy = [];
    vm.createArraySkills = [];
    vm.monthSelection = [];
    vm.dateList = [];
    vm.showFilters = false;
    vm.searchBySkills = false;
    vm.emplCopy = [];
    vm.createArraySkills = [];
    vm.arraySkill = [];
    vm.arrayProject = [];
    vm.arrayLanguage = [];
    vm.skillLevels = ["Junior", "Junior-Mid", "Mid", "Mid-Senior", "Senior"];
    vm.manager = ["Manager"];
    vm.table = {
      options: {
        rowSelection: true,
        multiSelect: true,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
      },
      query: {
        order: 'firstName',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: []
    };
    if (vm.candidate) {
      vm.addTitle = "Add candidate";
    } else {
      vm.addTitle = "Add employee";
    }





    // ----------------------------------------------------------------------
    // Public methods
    // ----------------------------------------------------------------------

    vm.querySearch = querySearch;
    vm.showFormDialog = showFormDialog;
    vm.showFormJsonDialog = showFormJsonDialog;
    vm.deleteConfirm = deleteConfirm;
    vm.multipleDelete = multipleDelete;
    vm.querySearchSkills = querySearchSkills;
    vm.selectedSkillChange = selectedSkillChange;
    vm.querySearchProjects = querySearchProjects;
    vm.selectedProjectChange = selectedProjectChange;
    vm.querySearchLanguage = querySearchLanguage;
    vm.selectedLanguageChange = selectedLanguageChange;
    vm.selectedSkillLeve = selectedSkillLeve;
    vm.selectedMonthDate = selectedMonthDate;
    vm.searchFilter = searchFilter;
    vm.searchPeriodFilter = searchPeriodFilter;
    vm.toggleFilters = toggleFilters;
    vm.selectedManagerPr = selectedManagerPr;
    vm.getHeader = getHeader;
    vm.getArray = getArray;
    vm.removeSearchProject = removeSearchProject;
    vm.removeSearchSkills = removeSearchSkills;
    vm.removeSearchLanguage = removeSearchLanguage;
    vm.sendToEmployee = sendToEmployee;
    vm.searchBirthdayFilter = searchBirthdayFilter;
    vm.clearBirthdayFilter = clearBirthdayFilter;
    vm.selectedPositionTitle = selectedPositionTitle;
    vm.clearPositionTitle = clearPositionTitle;
    vm.changeSkillLevelFilter = changeSkillLevelFilter;
    vm.selectedbirthdayMonth = selectedbirthdayMonth;
    // vm.searchSkillChange = searchSkillChange;
    // vm.searchSkills = searchSkills;





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    getEmployees();
    getSkills();
    getProjects();
    getLanguages();




    // ----------------------------------------------------------------------
    // Public methods declaration
    // ----------------------------------------------------------------------

    function showFormDialog(event, employees, employee) {
      event.stopPropagation();
      if (!employee) {
        employee = new Employee({});
      }
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'employeeForm.tmpl.html',
        controller: 'empoloyeeModal as empoloyeeM',
        targetEvent: event,
        clickOutsideToClose: true,
        data: {
          employee: employee,
          candidate: vm.candidate
        }
      });
    }

    function getHeader() {
      return [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Skills",
        "Languages",
        "Equipments",
        "Projects",
        "Jobs",
        "Date of Employment",
        "Address",
        "Urgent Contact Name",
        "Urgent Contact Phone",
        "Education", "Courses"
      ];
    }

    function getArray() {
      var temporary = [];
      for (var i = 0; i < vm.employees.length; i++) {
        var skills = [];
        var languages = [];
        var equipments = [];
        var projects = [];
        var job = [];
        var date = [];
        var adress = [];
        var contactName = [];
        var contactNumber = [];
        var education = [];
        var courses = [];
        if (vm.employees[i].skills) {
          for (var j = 0; j < vm.employees[i].skills.length; j++) skills.push(vm.employees[i].skills[j].label);
        }
        if (vm.employees[i].languages) {
          for (var l = 0; l < vm.employees[i].languages.length; l++) languages.push(vm.employees[i].languages[l].language);
        }
        if (vm.employees[i].equipments) {
          for (var e = 0; e < vm.employees[i].equipments.length; e++) equipments.push(vm.employees[i].equipments[e].name);
        }
        if (vm.employees[i].projects) {
          for (var p = 0; p < vm.employees[i].projects.length; p++) projects.push(vm.employees[i].projects[p].name);
        }
        if (vm.employees[i].jobDetail) {
          for (var jb = 0; jb < vm.employees[i].jobDetail.length; jb++) job.push(vm.employees[i].jobDetail[jb].name);
        }
        if (vm.employees[i].dateOfEmployment) {
          for (var d = 0; d < vm.employees[i].dateOfEmployment.length; d++) date.push(vm.employees[i].dateOfEmployment[d]);
        }
        if (vm.employees[i].address) {
          for (var a = 0; a < vm.employees[i].address.length; a++) adress.push(vm.employees[i].address[a].adresa);
        }
        if (vm.employees[i].urgentContact) {
          for (var c = 0; c < vm.employees[i].urgentContact.length; c++) {
            contactName.push(vm.employees[i].urgentContact[c].ContactName);
            contactNumber.push(vm.employees[i].urgentContact[c].Contact);
          }
        }
        if (vm.employees[i].education) {
          for (var ed = 0; ed < vm.employees[i].education.length; ed++) education.push(vm.employees[i].education[ed].school);
        }
        if (vm.employees[i].coursesAndCertifications) {
          for (var co = 0; co < vm.employees[i].coursesAndCertifications.length; co++) courses.push(vm.employees[i].coursesAndCertifications[co].title);
        }
        temporary.push({
          firstName: vm.employees[i].firstName,
          lastName: vm.employees[i].lastName,
          email: vm.employees[i].emailAssist,
          phone: vm.employees[i].phone,
          skills: skills.join(),
          languages: languages.join(),
          equipments: equipments.join(),
          projects: projects.join(),
          jobs: job.join(),
          dateOfEmployment: date.join("").slice(0, 10),
          address: adress,
          contactName: contactName,
          contactNumber: contactNumber,
          education: education.join(),
          courses: courses.join()
        });
      }
      return temporary;
    }

    function showFormJsonDialog(event) {
      event.stopPropagation();
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'employeeJsonForm.tmpl.html',
        controller: 'empoloyeeJsonModal as empoloyeeJsonM',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function deleteConfirm(event, employee, index) {
      event.stopPropagation();
      var confirm = $mdDialog.confirm().title('Delete the' + employee.getFullName() + ' employee ?').targetEvent(event).cancel('No').ok('Yes');
      $mdDialog.show(confirm).then(function() {
        removeEmployee(employee, index);
      });
    }

    function searchFilter(index) {
      final = vm.employees.map(function(employee) {

        return employee.holidays.map(function(per) {
          for (var i = 0; i < per.period.length; i++) {
            date = new Date(per.period[i].from);
          }

          if (vm.monthSelection[index] === vm.monthsList[date.getMonth()]) {
            filtru.push(employee);
          }

          return filtru;
        });
      });

      vm.employees = filtru;
    }

    function searchPeriodFilter(index) {
      final = vm.employees.map(function(employee) {
        return employee.holidays.map(function(per) {
          for (var i = 0; i < per.period.length; i++) date = new Date(per.period[i].from);
          if ((date.getTime() <= vm.dateList.to.getTime() && date.getTime() >= vm.dateList.from.getTime())) filtru.push(employee);
          return filtru;
        });
      });
      vm.employees = filtru;
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.employees);
    }

    function selectedMonthDate(data, index) {
      if (data !== undefined) {
        vm.monthSelection[index] = data;
        return data;
      } else {
        return "Pick a month";
      }
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function sendToEmployee(data, index) {
      var info = angular.copy(data);
      delete data.id;
      Employee.save(data).then(function(info) {
        $rootScope.showToast('Employee created successfully!');
      }, function(err) {
        $rootScope.showToast('Failed to create employee');
      });
      removeEmployee(info, index);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function getEmployees() {
      Employee.getAll(vm.candidate).then(function(data) {
        vm.employees = data;
        vm.emplCopy = angular.copy(vm.employees);
        return autocompleteService.buildList(vm.employees, ['firstName', 'lastName']);
      }, function(data) {});
    }

    function removeEmployee(employee, $index) {
      var employeeToRemove = {
        id: employee.id
      };
      Employee.remove(employeeToRemove, vm.candidate).then(function(data) {
        var employeeIndex = miscellaneousService.getItemIndex(vm.employees, employee.id);
        vm.employees.splice(employeeIndex, 1);
        $rootScope.showToast('Employee deleted successfully!');
      }, function(data) {
        $rootScope.showToast('Failed to delete employee');
      });
    }

    function multipleDelete() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.employees = _.without(vm.employees, _.findWhere(vm.employees, {
          id: vm.table.selected[i].id
        }));
      }
      Employee.remove({
        id: vm.ids
      }, vm.candidate).then(function(res) {
        // Callback.success("All employees was deleted");
        vm.table.selected = [];
      }, function(err) {
        // Callback.error("Failed to delete !");
      });
    }
    $scope.$on('employeesListChanged', function(event, args) {
      var employee = args[1];
      var employeeIndex = '';
      switch (args[0]) {
        case 'save':
          vm.employees.push(employee);
          break;
        case 'saveFromJson':
          vm.employees = vm.employees.concat(employee);
          break;
        case 'update':
          employeeIndex = miscellaneousService.getItemIndex(vm.employees, employee.id);
          vm.employees[employeeIndex] = angular.copy(employee);
          break;
        default:
          getEmployees();
      }
    });




    // ----------------------------------------------------------------------
    // Employee filters
    // ----------------------------------------------------------------------

    function getSkills() {
      skillModel.getAll().then(function(data) {
        vm.allSkills = data;
        return autocompleteService.buildList(vm.allSkills, ['name']);
      }, function(err) {});
    }

    function querySearchSkills(query) {
      return autocompleteService.querySearch(query, vm.allSkills);
    }

    function selectedSkillChange(items, list) {
      if (items !== undefined) {
        vm.arraySkill.push(items);
        var result = _.filter(list, function(item) {
          if (item.skills.length > 0) {
            var final = _.filter(item.skills, function(skil) {
              if (skil.label === items) {
                return item;
              }
            })
            if (final.length > 0) {
              return final;
            }
          }
        })
        vm.employees = result;
      }
    }

    function removeSearchSkills(index) {
      vm.arraySkill.splice(index, 1);
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }
    // search projects
    function getProjects() {
      ProjectModel.getAll().then(function(data) {
        vm.projects = data;
        return autocompleteService.buildList(vm.projects, ['name']);
      }, function(data) {});
    }

    function querySearchProjects(query) {
      return autocompleteService.querySearch(query, vm.projects);
    }

    function selectedProjectChange(items, list) {
      if (items !== undefined) {
        vm.arrayProject.push(items);
        var result = _.filter(list, function(item) {
          if (item.projects.length > 0) {
            var final = _.filter(item.projects, function(project) {
              if (project.name === items) {
                return item;
              }
            })
            if (final.length > 0) {
              return final;
            }
          }
        })
        vm.employees = result;
      }
    }

    function removeSearchProject(index) {
      vm.arrayProject.splice(index, 1);
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }
    // search languages
    function getLanguages() {
      Employee.getLanguages().then(function(data) {
        vm.languages = data;
        return autocompleteService.buildList(vm.languages, ['name']);
      }, function(err) {
        $rootScope.showToast('Something gone wrong');
        //Callback.error();
      });
    }

    function querySearchLanguage(query) {
      return autocompleteService.querySearch(query, vm.languages);
    }

    function selectedLanguageChange(items, list) {
      if (items !== undefined) {
        vm.arrayLanguage.push(items);
        var result = _.filter(list, function(item) {
          if (item.languages != null) {
            var final = _.filter(item.languages, function(lang) {
              if (lang.language === items) {
                return item;
              }
            })
            if (final.length > 0) {
              return final;
            }
          }
        })
        vm.employees = result;
      }
    }

    function removeSearchLanguage(index) {
      vm.arrayLanguage.splice(index, 1);
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }

    function searchWhenRemove(projectInfo, skillInfo, languageInfo) {
      var employeeCopy = vm.emplCopy;
      var resFinal;
      if (projectInfo.length > 0) {
        resFinal = _.filter(projectInfo, function(items) {
          var result = _.filter(employeeCopy, function(item) {
            if (item.projects.length > 0) {
              var final = _.filter(item.projects, function(project) {
                if (project.name === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          employeeCopy = result;
          vm.employees = result;
        })
      } else {
        vm.employees = employeeCopy;
      }
      if (skillInfo.length > 0) {
        resFinal = _.filter(skillInfo, function(items) {
          var result = _.filter(employeeCopy, function(item) {
            if (item.skills.length > 0) {
              var final = _.filter(item.skills, function(skil) {
                if (skil.label === items) {
                  return item;
                }
              });
              if (final.length > 0) {
                return final;
              }
            }
          });
          employeeCopy = result;
          vm.employees = result;
        });
      } else {
        vm.employees = employeeCopy;
      }
      if (languageInfo.length > 0) {
        resFinal = _.filter(languageInfo, function(items) {
          var result = _.filter(employeeCopy, function(item) {
            if (item.languages != null) {
              var final = _.filter(item.languages, function(lang) {
                if (lang.language === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          employeeCopy = result;
          vm.employees = result;
        });
      } else {
        vm.employees = employeeCopy;
      }
    }
    // search Project manager
    function selectedManagerPr(items, list) {
      if (items !== undefined) {
        selectedManagerChange(items, list);
        return items;
      } else {
        return "Manager";
      }
    }

    function selectedManagerChange(items, list) {
      if (items !== undefined) {
        var result = _.filter(list, function(item) {
          if (item.projects.length > 0) {
            var final = _.filter(item.projects, function(project) {
              if (project.manager === item.firstName + ' ' + item.lastName) {
                return item;
              }
            });
            if (final.length > 0) {
              return final;
            }
          }
        });
        vm.employees = result;
      }
    }
    // search level
    function selectedSkillLeve(items, list) {
      if (items !== undefined) {
        levelFilter(items, list);
        return items;
      } else {
        return "Experience";
      }
    }

    function levelFilter(items, list) {
      var first;
      var second;
      switch (items) {
        case 'Junior':
          first = 1;
          second = 2;
          break;
        case 'Junior-Mid':
          first = 3;
          second = 4;
          break;
        case 'Mid':
          first = 5;
          second = 6;
          break;
        case 'Mid-Senior':
          first = 7;
          second = 8;
          break;
        case 'Senior':
          first = 9;
          second = 10;
          break;
        default:
          first = 1;
          second = 2;
      }
      first = first.toString();
      second = second.toString();
      var result = _.filter(list, function(item) {
        if (item.skillsLevel != null) {
          var final = _.filter(item.skillsLevel, function(level) {
            if (level === first || level === second) {
              return item;
            }
          })
          if (final.length > 0) {
            return final;
          }
        }
      });
      vm.employees = result;
    }

    function changeSkillLevelFilter() {
      vm.birthdayDate = undefined;
      vm.positionTitle = undefined;
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }
    //filter by birthday
    function selectedbirthdayMonth(birthday, list) {
      if (birthday !== undefined) {
        var brdMonthNumber = transformMonth(birthday);
        birthdayFilter(brdMonthNumber, list);
        return vm.birthdayMonth;
      } else {
        return "Birthday Month";
      }
    }

    function birthdayFilter(birthdays, list) {
      if (birthdays !== undefined) {
        var result = _.filter(list, function(item) {
          if (item.birthday !== null) {
            item.birthday = new Date(item.birthday);
            if (item.birthday.getMonth() === birthdays) {
              return item;
            }
          }
        })
        vm.employees = result;
      }
    }

    function searchBirthdayFilter(year, list) {
      if (year !== undefined) {
        year = parseInt(year, 10);
        var result = _.filter(list, function(item) {
          if (item.birthday != null) {
            item.birthday = new Date(item.birthday);
            if (item.birthday.getFullYear() === year) {
              return item;
            }
          }
        })
        vm.employees = result;
      }
    }

    function clearBirthdayFilter() {
      vm.bornYear = "";
      vm.selectedbirthdayMonth = undefined;
      vm.positionTitle = undefined;
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }

    //filter by positionTitle
    function selectedPositionTitle(position, list) {
      if (position !== undefined) {
        selectedPositionTitleFilter(position, list);
        return position;
      } else {
        return "Position title...";
      }
    }

    function selectedPositionTitleFilter(position, list) {
      var result = _.filter(list, function(item) {
        if (item.assistPositionTitle != null) {
          if (item.assistPositionTitle === position) {
            return item;
          }
        }
      });
      vm.employees = result;
    }

    function clearPositionTitle() {
      vm.selectedSkillLevel = undefined;
      vm.positionTitle = undefined;
      vm.birthdayDate = undefined;
      searchWhenRemove(vm.arrayProject, vm.arraySkill, vm.arrayLanguage);
    }

    function reset() {
      vm.employees = vm.emplCopy;
      vm.arraySkill = [];
      vm.searchSkill = "";
      vm.arrayProject = [];
      vm.searchProject = "";
      vm.arrayLanguage = [];
      vm.searchLanguage = "";
      vm.selectedManager = undefined;
      vm.selectedSkillLevel = undefined;
      filtru = [];
      vm.dateList = [];
      vm.selectedMonth = undefined;
      vm.positionTitle = undefined;
      vm.birthdayDate = undefined;
    }

    function transformMonth(month) {
      switch (month) {
        case 'January':
          return 0;
          break;
        case 'February':
          return 1
          break;
        case 'March':
          return 2;
          break;
        case 'April':
          return 3;
          break;
        case 'May':
          return 4;
          break;
        case 'June':
          return 5;
          break;
        case 'July':
          return 6;
          break;
        case 'August':
          return 7;
          break;
        case 'September':
          return 8;
          break;
        case 'October':
          return 9;
          break;
        case 'November':
          return 10
          break;
        case 'December':
          return 11;
          break;
        default:
          return 0;
      }
    }

  }

}());

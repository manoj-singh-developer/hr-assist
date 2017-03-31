(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('Employee', Employee);

  Employee
    .$inject = ['$q', '$resource', 'apiUrl'];

  function Employee($q, $resource, apiUrl) {

    var url = '';
    var holidayTransferIndex = 0;

    // ----------------------------------------------------------------------
    // CONSTRUCTOR
    // ----------------------------------------------------------------------

    function Employee(employee) {
      // GENERAL INFO
      this.firstName = employee.firstName ? employee.firstName : '';
      this.middleName = employee.middleName ? employee.middleName : '';
      this.lastName = employee.lastName ? employee.lastName : '';
      this.address = employee.address ? employee.address : null;
      this.phone = employee.phone ? employee.phone : undefined;
      this.emailAssist = employee.emailAssist ? employee.emailAssist : undefined;
      this.emailOther = employee.emailOther ? employee.emailOther : undefined;
      this.urgentContact = employee.urgentContact ? employee.urgentContact : {};

      // JOB RELATED
      this.status = employee.status ? employee.status : true;
      this.jobTitle = employee.jobTitle ? employee.jobTitle : '';
      this.dateOfEmployment = employee.dateOfEmployment ? employee.dateOfEmployment : new Date();
      this.languages = employee.languages ? employee.languages : [];
      this.education = employee.education ? employee.education : [];
      this.diplomas = employee.diplomas ? employee.diplomas : [];
      this.coursesAndCertifications = employee.coursesAndCertifications ? employee.coursesAndCertifications : [];
      this.schedule = employee.schedule ? employee.schedule : [];
      this.department = employee.department ? employee.department : '';
      this.holidays = employee.holidays ? employee.holidays : [];
      this.skills = employee.skills ? employee.skills : [];
      this.skillsLevel = employee.skillsLevel ? employee.skillsLevel : [];
      this.equipments = employee.equipments ? employee.equipments : [];
      this.projects = employee.projects ? employee.projects : [];
    }





    // ----------------------------------------------------------------------
    // PUBLIC METHODS ASIGNED TO PROTOTYPE
    // ----------------------------------------------------------------------

    angular.extend(Employee.prototype, {
      getFullName: function() {
        return this.firstName + ' ' + this.lastName;
      }
    });





    // ----------------------------------------------------------------------
    // STATIC METHODS ASIGNED TO CLASS
    // ----------------------------------------------------------------------
    Employee.create = function(data) {
      return angular.extend(new Employee(data), data);
    };

    Employee.addIndex = function(clickedIndex) {
      holidayTransferIndex = clickedIndex;
    };

    Employee.getIndex = function() {
      return holidayTransferIndex;
    };

    Employee.getAll = function(candidate) {
      var raw = [];
      var processed = [];
      var newItem = {};

      function promise(resolve, reject) {
        getAllEmployees(candidate).$promise.then(
          function(data) {
            raw = data.items;

            angular.forEach(raw, function(item, index) {
              processed.push(Employee.create(item));
            });
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong: ', error);
          });
      }

      return $q(promise);
    };

    Employee.getById = function(id, candidate) {
      function promise(resolve, reject) {
        getEmployeeById(id, candidate).$promise.then(
          function(data) {
            return resolve(Employee.create(data));
          },
          function(error) {
            return reject('Something gone wrong: ', error);
          });
      }

      return $q(promise);
    };

    Employee.save = function(data, candidate) {
      function promise(resolve, reject) {
        saveEmployee(data, candidate).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Employee.savefromJson = function(data, candidate) {
      function promise(resolve, reject) {
        saveFromJson(data, candidate).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(err) {
            return reject(err);
          });

      }
      return $q(promise);
    };

    Employee.remove = function(id, candidate) {
      function promise(resolve, reject) {
        removeEmployee(id, candidate).$promise.then(
          function(id) {
            return resolve('User was deleted successfuly!');
          },
          function(error) {
            return reject('Something gone wrong! ( ', error, ' )');
          });
      }

      return $q(promise);
    };

    Employee.update = function(data, candidate) {
      // De investigat de ce cand skills e empty nu face update
      function promise(resolve, reject) {
        updateEmployee(data, candidate).$promise.then(
          function(data) {
            resolve('User was updated successfuly!');
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Employee.getLanguages = function() {

      function promise(resolve, reject) {
        getAllLanguages().$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject('Something gone wrong!', error);
          });
      }

      return $q(promise);
    };





    // ----------------------------------------------------------------------
    // PRIVATE METHODS
    // ----------------------------------------------------------------------

    function getAllEmployees(candidate) {
      if (candidate) {
        url = apiUrl + "/candidate";
      } else {
        url = apiUrl + "/users";
      }

      return $resource(url, {
        'query': {
          method: 'GET',
          isArray: false
        }
      }).get();



      // return $resource(url).query();
    }

    function getEmployeeById(id, candidate) {
      if (candidate) {
        url = apiUrl + "/candidate/" + id;
      } else {
        url = apiUrl + "/users/" + id;
      }

      return $resource(url).get();
    }

    function saveEmployee(data, candidate) {
      if (candidate) {
        url = apiUrl + "/candidate";
      } else {
        url = apiUrl + "/employee";
      }

      return $resource(url).save(data);
    }

    function saveFromJson(data, candidate) {
      if (candidate) {
        url = apiUrl + "/candidate";
      } else {
        url = apiUrl + "/employee";
      }

      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);
    }

    function updateEmployee(employeeToUpdate, candidate) {
      if (candidate) {
        url = apiUrl + "/candidate/" + employeeToUpdate.id;
      } else {
        url = apiUrl + "/employee/" + employeeToUpdate.id;
      }

      if (employeeToUpdate.skills) {
        employeeToUpdate.skills =
          employeeToUpdate.skills.map(function(item) {
            return parseInt(item.id);
          });
      } else {
        employeeToUpdate.skills = null;
      }
      if (employeeToUpdate.projects) {
        employeeToUpdate.projects = employeeToUpdate.projects.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        employeeToUpdate.projects = null;
      }

      if (employeeToUpdate.equipments) {
        employeeToUpdate.equipments = employeeToUpdate.equipments.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        employeeToUpdate.equipments = null;
      }

      if (employeeToUpdate.holidays) {
        employeeToUpdate.holidays = employeeToUpdate.holidays.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        employeeToUpdate.holidays = null;
      }

      return $resource(url,
        employeeToUpdate, {
          'update': {
            method: 'PUT'
          }
        }).save();
    }

    function removeEmployee(employeeToRemove, candidate) {
      if (candidate) {
        url = apiUrl + "/candidate";
      } else {
        url = apiUrl + "/employee";
      }

      return $resource(url).delete(employeeToRemove);
    }

    function getAllLanguages() {
      url = apiUrl + "/languages";
      
      return $resource(url, {
        'query': {
          method: 'GET',
          isArray: false
        }
      }).get();

    }

    return Employee;

  }

}());

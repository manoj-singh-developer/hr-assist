(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('HolidayModel', HolidayModel);

  HolidayModel
    .$inject = ['$q', '$resource', 'Employee', 'apiUrl'];

  function HolidayModel($q, $resource, Employee, apiUrl) {

    // Constructor
    // ------------------------------------------------------------------------
    function Holiday(employeeName, employee) {
      this.employee = employee || [];
    }
    var url = '';



    // Public methods asigned to prototype
    // ------------------------------------------------------------------------
    angular.extend(Holiday.prototype, {
      getFullName: function() {
        return this.firstName + ' ' + this.lastName;
      }
    });



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Holiday.create = function(data) {
      return angular.extend(new Holiday(), data);
    };

    Holiday.getAll = function() {
      var raw = [];
      var processed = [];
      var newItem = {};

      function promise(resolve, reject) {
        getAllHolidays().$promise.then(
          function(data) {
            raw = data;
            angular.forEach(raw, function(item, index) {
              processed.push(Holiday.create(item));
            });
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    Holiday.getHolidayById = function(id) {
      function promise(resolve, reject) {
        getHolidayById(id).$promise.then(
          function(data) {
            return resolve(Holiday.create(data));
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    Holiday.save = function(data) {
      function promise(resolve, reject) {
        saveHoliday(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Holiday.savefromJson = function(data) {
      function promise(resolve, reject) {
        saveFromJson(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(err) {
            return reject(err);
          });

      }
      return $q(promise);
    };

    Holiday.remove = function(id) {
      function promise(resolve, reject) {
        removeHoliday(id).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Holiday.update = function(data) {
      function promise(resolve, reject) {
        updateHoliday(data).$promise.then(
          function(data) {
            resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };



    // Private methods
    // ------------------------------------------------------------------------
    function getAllHolidays() {
      url = apiUrl + "/holidays";
      return $resource(url).query();
    }

    function getHolidayById(id) {
      url = apiUrl + "/holidays/" + id;
      return $resource(url).get();
    }


    function saveHoliday(data) {

      if (data.replacementEmployees) {
        data.replacementEmployees = data.replacementEmployees.map(function(item) {
          return parseInt(item.id);
        });
      }

      if (data.replacementProjects) {
        data.replacementProjects = data.replacementProjects.map(function(item) {
          return parseInt(item.id);
        });
      }

      if (data.employee) {
        data.employee = data.employee.id;
      }

      if (data.teamLeader) {
        data.teamLeader = data.teamLeader.id;
      }

      url = apiUrl + "/holidays";

      return $resource(url).save(data);
    }


    function saveFromJson(data) {

      url = apiUrl + "/holidays";
      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);

    }


    function updateHoliday(data) {

      url = apiUrl + "/holidays/" + data.id;

      if (data.replacementEmployees) {
        data.replacementEmployees = data.replacementEmployees.map(function(item) {
          return parseInt(item.id);
        });
      }

      if (data.replacementProjects) {
        data.replacementProjects = data.replacementProjects.map(function(item) {
          return parseInt(item.id);
        });
      }

      if (data.employee) {
        data.employee = data.employee.id;
      }

      if (data.teamLeader) {
        data.teamLeader = data.teamLeader.id;
      }

      return $resource(url, data, {
        'update': {
          method: 'PUT'
        }
      }).save();

    }


    function removeHoliday(holidayToRemove) {
      url = apiUrl + "/holidays";
      return $resource(url).delete(holidayToRemove);
    }

    return Holiday;

  }

}());

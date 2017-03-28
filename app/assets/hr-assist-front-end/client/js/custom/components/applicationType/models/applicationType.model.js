(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('appType', appType);

  appType
    .$inject = ['$q', '$resource', 'apiUrl'];

  function appType($q, $resource, apiUrl) {

    function applicationType() {
      this.projects = projects || [];

    }
    var url = '';
    var projects;



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    applicationType.create = function(data) {

      return angular.extend(new applicationType(), data);
    };

    applicationType.getAll = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getProjectData().$promise.then(
          function(data) {
            raw = data;
            angular.forEach(raw, function(item, index) {
              processed.push(applicationType.create(item));

            });
            return resolve(processed);
          },
          function(err) {
            console.log("Something wrong", err);
          });
      }
      return $q(promise);
    };


    applicationType.saveAll = function(data) {
      function promise(resolve, reject) {
        saveProjectData(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject("wut", error);
          });
      }
      return $q(promise);
    }

    applicationType.remove = function(id) {
      function promise(resolve, reject) {
        removeProjectData(id).$promise.then(
          function(id) {
            return resolve('Project was deleted successfuly!');
          },
          function(error) {
            return reject('Something gone wrong! ( ', error, ' )');
          });
      }

      return $q(promise);
    };

    applicationType.update = function(data) {
      function promise(resolve, reject) {
        updateProjectData(data).$promise.then(
          function(data) {
            resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    applicationType.getFromApi = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAppTypeFromApi().$promise.then(
          function(data) {
            raw = data.applicationTypes;
            angular.forEach(raw, function(item, index) {
              processed.push({
                name: item
              });
            });
            saveProjectData(processed);
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }
      return $q(promise);
    };


    // Private methods
    // ------------------------------------------------------------------------

    function getProjectData() {
      url = apiUrl + "/applicationtype";
      return $resource(url).query();
    }

    function getProjectDataById(id) {
      url = apiUrl + "/applicationtype/" + id;
      return $resource(url).get();
    }

    function saveProjectData(data) {
      url = apiUrl + "/applicationtype";
      return $resource(url, data, {
        'save': {
          method: 'POST',
          isArray: true
        }
      }).save(data);
    }

    function updateProjectData(appToUpdate) {
      url = apiUrl + "/applicationtype/" + appToUpdate.id;

      return $resource(url,
        appToUpdate, {
          'update': {
            method: 'PUT'
          }
        }).save();
    }

    function removeProjectData(appToRemove) {
      url = apiUrl + "/applicationtype";
      return $resource(url).delete(appToRemove);
    }

    function getAppTypeFromApi() {
      url = 'https://assist-software.net/api/technologiesandapplicationtypes';
      return $resource(url).get();
    }

    return applicationType;

  }

}());

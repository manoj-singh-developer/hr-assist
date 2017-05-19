(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('TrainingModel', TrainingModel);

  TrainingModel
    .$inject = ['$q', '$resource', 'apiUrl'];

  function TrainingModel($q, $resource, apiUrl) {

    // Constructor
    // ------------------------------------------------------------------------
    function Training(training) {}
    var url = '';



    // Public methods asigned to prototype
    // ------------------------------------------------------------------------



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Training.getAll = function() {
      function promise(resolve, reject) {
        getAllTrainings().$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Training.save = function(data) {
      function promise(resolve, reject) {
        save(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Training.update = function(data) {
      function promise(resolve, reject) {
        updateTraining(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }
      return $q(promise);
    }

    Training.remove = function(id, extraType) {
      function promise(resolve, reject) {
        removeTraining(id).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    // Private methods
    // ------------------------------------------------------------------------
    function getAllExtra(extraType) {
      url = apiUrl + "/training";
      return $resource(url).query();
    }

    function save(data, extraType) {
      url = apiUrl + "/training";
      return $resource(url).save(data);
    }

    function updateExtra(data, extraType) {
      url = apiUrl + "/training" + '/' + data.id;
      return $resource(url,
        data, {
          'update': {
            method: 'PUT'
          }
        }).save();
    }

    function removeExtra(id) {
      url = apiUrl + "/training";
      return $resource(url).delete(id);
    }

    return Extra;

  }
})();

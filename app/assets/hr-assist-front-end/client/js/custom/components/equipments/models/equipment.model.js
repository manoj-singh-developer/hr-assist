(function() {

  'use strict';


  // equipmentsModel
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .factory('Equipments', equipmentsModel);

  equipmentsModel
    .$inject = ['$resource', '$q', 'apiUrl', '$http'];

  function equipmentsModel($resource, $q, apiUrl, $http) {

    // Constructor
    // ------------------------------------------------------------------------
    function Equipments() {

    }
    var url = '';

    angular.extend(Equipments.prototype, {
      getFullName: function() {
        return this.name + ' ' + this.description;
      }
    });



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Equipments.create = function(data) {
      return angular.extend(new Equipments(), data);
    };

    Equipments.list = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllEquipments().$promise.then(
          function(data) {
            raw = data.items;
            angular.forEach(raw, function(item, index) {
              processed.push(Equipments.create(item));
            });

            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    Equipments.save = function(data) {
      function promise(resolve, reject) {
        saveEquipments(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Equipments.saveJson = function(data) {
      function promise(resolve, reject) {
        saveFromJson(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Equipments.remove = function(id) {
      function promise(resolve, reject) {
        removeEquipments(id).$promise.then(
          function(id) {
            return resolve('User was deleted successfuly!');
          },
          function(error) {
            return reject('Something gone wrong! ( ', error, ' )');
          });
      }

      return $q(promise);
    };

    Equipments.update = function(data) {
      if (data.ownerss != undefined) {
        data.ownerss = data.ownerss.map(function(item) {
          return item.id;
        })
      }

      function promise(resolve, reject) {
        updateEquipments(data).then(
          function(data) {
            resolve('User was updated successfuly!');
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Equipments.getEquipmentsById = function(id) {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getEquipmentsById(id).$promise.then(
          function(data) {
            return resolve(Equipments.create(data));
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    // Private methods
    // ------------------------------------------------------------------------

    function getAllEquipments() {
      url = apiUrl + "/devices";

      return $resource(url, {
        'query': {
          method: 'GET',
          isArray: false
        }
      }).get();
    }

    function saveEquipments(data) {
      url = apiUrl + "/devices/new";
      return $resource(url).save(data);
    }

    function updateEquipments(data) {
      url = apiUrl + "/devices/" + data.id;
       return $http.put(url, data);
    }

    function saveFromJson(data) {
      url = apiUrl + "/devices/new";
      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);
    }

    function removeEquipments(equipmentToRemove) {
      url = apiUrl + "/devices/"+equipmentToRemove.id;
      return $resource(url).delete();
    }

    function getEquipmentsById(id) {
      url = apiUrl + "/devices/" + id;
      return $resource(url).get();
    }

    return Equipments;
  }
}());

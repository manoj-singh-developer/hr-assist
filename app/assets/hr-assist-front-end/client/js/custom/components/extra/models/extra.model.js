(function() {

  'use strict';


  angular
    .module('HRA')
    .factory('ExtraModel', ExtraModel);

  ExtraModel
    .$inject = ['$q', '$resource', 'skillModel', 'Equipments', 'apiUrl', 'updateModel'];

  function ExtraModel($q, $resource, skillModel, Equipments, apiUrl, updateModel) {

    // Constructor
    // ------------------------------------------------------------------------
    function Extra(employee) {}
    var url = '';
    var holidayTransferIndex = 0;
    var extraTypeUrl = "";

    // Public methods asigned to prototype
    // ------------------------------------------------------------------------



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Extra.getAllExtra = function(extraType) {
      function promise(resolve, reject) {
        getAllExtra(extraType).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Extra.save = function(data, extraType) {
      function promise(resolve, reject) {
        save(data, extraType).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Extra.update = function(data, extraType) {
      function promise(resolve, reject) {
        updateExtra(data, extraType).$promise.then(
          function(data) {
            //return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }
      return $q(promise);
    };

    Extra.remove = function(id, extraType) {
      function promise(resolve, reject) {
        removeExtra(id, extraType).$promise.then(
          function(id, extraType) {
            return resolve('User was deleted successfuly!');
          },
          function(error) {
            return reject('Something gone wrong! ( ', error, ' )');
          });
      }

      return $q(promise);
    };

    Extra.savefromJson = function(data, extraType) {
      function promise(resolve, reject) {
        saveFromJson(data, extraType).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(err) {
            return reject(err);
          });

      }
      return $q(promise);
    };

    // Private methods
    // ------------------------------------------------------------------------
    function getAllExtra(extraType) {
      url = getURL(extraType);
      return $resource(url,{'query':{method:'GET',isArray:true}}).get();
    }

    function save(data, extraType) {
      url = getURL(extraType);
      var url2 = url + '/new'; 
      return $resource(url2,data).save(data);
    }

    function updateExtra(data, extraType) {
      url = getURL(extraType);
      var url2 = url + '/' + data.id;
      return updateModel.update({path:extraTypeUrl,id:data.id},data);
    }

    function removeExtra(id, extraType) {

      url = getURL(extraType);
      var url2 = url + "/" + id.id;
      return $resource(url2).delete(id);
    }

    function saveFromJson(data, extraType) {
      url = getURL(extraType);

      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);
    }

    function getURL(extraType) {
      var appUrl = '';

      switch (extraType) {
        case 'industries':
          appUrl = apiUrl + "/industry";
          break;

        case 'appTypes':
          appUrl = apiUrl + "/application_types";
          extraTypeUrl = "application_types";
          break;

        case 'customers':
          appUrl = apiUrl + "/customer";
          break;

        default:
          break;
      }

      return appUrl;
    }

    return Extra;

  }
}());

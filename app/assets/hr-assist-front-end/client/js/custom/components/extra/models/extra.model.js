(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('ExtraModel', ExtraModel);

  ExtraModel
    .$inject = ['$q', '$resource', 'skillModel', 'Equipments', 'apiUrl', '$http', '$state'];

  function ExtraModel($q, $resource, skillModel, Equipments, apiUrl, $http, $state) {

    // Constructor
    // ------------------------------------------------------------------------
    function Extra(employee) {}
    var url = '';
    var holidayTransferIndex = 0;



    // Public methods asigned to prototype
    // ------------------------------------------------------------------------



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Extra.getAllExtra = function(extraType) {
      function promise(resolve, reject) {
        getAllExtra(extraType).then(
          function(data) {

            return resolve(data.items);
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
              $state.reload();
              return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Extra.update = function(data, extraType) {

        if(extraType === 'industries'){

            function promise(resolve, reject) {
                updateExtra(data, extraType).then(
                    function(data) {
                        resolve(data);
                    },
                    function(error) {
                        return reject(error);
                    });
            }
            return $q(promise);

        } else {

            function promise(resolve, reject) {
                updateExtra(data, extraType).$promise.then(
                    function(data) {
                        resolve(data);
                    },
                    function(error) {
                        return reject(error);
                    });
            }
            return $q(promise);

        }
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
      var item = $resource(url).get();
      return item.$promise;
    }

    function save(data, extraType) {

        if(extraType === 'industries'){

           url = apiUrl + '/industries/new';
           return $resource(url).save(data);
        } else {

            url = getURL(extraType);
            return $resource(url).save(data);
        }
    }

    function updateExtra(data, extraType) {

        if(extraType === 'industries'){

            var industriesId = data.id;
            url = apiUrl + '/industries/' + industriesId;

            return $http.put(url, data);
        } else {

            url = getURL(extraType);
            var url2 = url + '/' + data.id;
            return $resource(url2,
                data, {
                    'update': {
                        method: 'PUT'
                    }
                }).save();
        }

    }

    function removeExtra(id, extraType) {

        if(extraType === 'industries'){
            var industriesId = id.id;
            url = apiUrl + '/industries/' + industriesId;
            return $resource(url).delete();
        } else {
            url = getURL(extraType);
            return $resource(url).delete(id);
        }
    }

    function saveFromJson(data, extraType) {
      url = getURL(extraType);

      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: false
          }
        }).save(data);
    }

    function getURL(extraType) {
      var appUrl = '';

      switch (extraType) {
        case 'industries':
          appUrl = apiUrl + "/industries";
          break;

        case 'appTypes':
          appUrl = apiUrl + "/applications_type";
          break;

        case 'customers':
          appUrl = apiUrl + "/customeres";
          break;

        default:
          break;
      }

      return appUrl;
    }

    return Extra;

  }
}());

(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Device', Device);

  Device
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function Device($resource, apiUrl, alertService) {

    function Device() {}

    let url = '';
    let promise = null;
    let resource = null;

    Device.save = function(data) {
      url = apiUrl + '/devices/new';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save(data);

      promise = resource.$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on save');
        });

      return promise;
    };

    Device.saveJson = function(data) {
      url = apiUrl + '/devices/new';
      resource = $resource(url, data, {
        'save': {
          method: 'POST',
          isArray: true
        }
      }).save(data);

      promise = resource.$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on saveJson');
        });

      return promise;
    };

    Device.update = function(data) {
      url = apiUrl + '/devices/:id';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      });

      promise = resource.update({ id: data.id }, data).$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on update');
        });

      return promise;
    };

    Device.getById = function(id) {
      url = apiUrl + '/devices/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on getById');
        });

      return promise;
    };

    Device.getAll = function() {
      url = apiUrl + '/devices';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(function(data) {
          return data.items;
        })
        .catch(function(error) {
          alertService.log('Device: error on getAll');
        });

      return promise;
    };

    Device.getEmployees = function(id) {
      url = apiUrl + '/devices/:id/users';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on getEmployees');
        });

      return promise;
    };

    Device.remove = function(id) {
      url = apiUrl + '/devices/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then(function(data) {
          return data;
        })
        .catch(function(error) {
          alertService.log('Device: error on remove');
        });

      return promise;
    };

    return Device;

  }

})();

(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Device', Device);

  Device
    .$inject = ['$resource', 'apiUrl', 'alertService', 'errorService'];

  function Device($resource, apiUrl, alertService, errorService) {

    function Device() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Device';


    Device.save = (data) => {
      url = apiUrl + '/devices/new';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          return data;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'save');
        });

      return promise;
    };

    Device.saveJson = (data) => {
      url = apiUrl + '/devices/new';
      resource = $resource(url, data, {
        'post': {
          method: 'POST',
          isArray: true
        }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'saveJson');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveJson');
        });

      return promise;
    };

    Device.update = (data) => {
      url = apiUrl + '/devices/:id';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: data.id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update');
        });

      return promise;
    };

    Device.getById = (id) => {
      url = apiUrl + '/devices/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getById');
        });

      return promise;
    };

    Device.getAll = () => {
      url = apiUrl + '/devices';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getAll');
        });

      return promise;
    };

    Device.getEmployees = (id) => {
      url = apiUrl + '/devices/:id/users';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getEmployees');
        });

      return promise;
    };

    Device.remove = (id) => {
      url = apiUrl + '/devices/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);;
          alertService.error(model, 'remove');
        });

      return promise;
    };

    Device.getComponents = () => {
      url = apiUrl + '/components';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getAll');
        });

      return promise;
    };

    return Device;

  }

})();

(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Technology', Technology);

  Technology
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function Technology($resource, apiUrl, alertService) {

    function Technology() {}


    var url = '';
    let promise = null;
    let resource = null;
    let model = 'Technology';


    Technology.save = (data) => {
      url = apiUrl + '/technologies/new';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          return data;
        })
        .catch(() => alertService.error(model, 'save'));

      return promise;
    };

    Technology.saveJson = (data) => {
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
        .catch(() => alertService.error(model, 'saveJson'));

      return promise;
    };

    Technology.update = (data) => {
      url = apiUrl + '/technologies/:id';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: data.id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update');
          return data;
        })
        .catch(() => alertService.error(model, 'update'));

      return promise;
    };

    Technology.getById = (id) => {
      url = apiUrl + '/technologies/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

      return promise;
    };

    Technology.getAll = () => {
      url = apiUrl + '/technologies';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getAll'));

      return promise;
    };

    Technology.getEmployees = (id) => {
      url = apiUrl + '/technologies/:id/users';
      resource = $resource(url, {id: id}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get();

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getEmployeeTechnologies'));
      return promise;
    };

    Technology.getProjects = (id) => {
      url = apiUrl + '/technologies/:id/projects';
      resource = $resource(url, {id: id}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get();

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getProjectsTechnologies'));
      return promise;
    };

    Technology.remove = (id) => {
      url = apiUrl + '/technologies/:id/';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    return Technology;
  }

})();

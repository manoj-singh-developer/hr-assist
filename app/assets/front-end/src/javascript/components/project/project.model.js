(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Project', Project);

  Project
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function Project($resource, apiUrl, alertService) {

    function Project() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Project';


    Project.save = (data) => {
      url = apiUrl + '/projects/new';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          return data;
        }).catch(() => alertService.error(model, 'save'));

      return promise;
    };

    Project.saveJson = (data) => {
      url = apiUrl + '/projects/new';
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

    Project.update = (data) => {
      url = apiUrl + '/projects/:id';
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

    Project.getById = (id) => {
      url = apiUrl + '/projects/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

      return promise;
    };

    Project.getAll = () => {
      url = apiUrl + '/projects';
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

    Project.getEmployees = (id) => {
      url = apiUrl + '/projects/:id/users';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getEmployees'));

      return promise;
    };

    Project.remove = (id) => {
      url = apiUrl + '/projects/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    return Project;

  }

})();

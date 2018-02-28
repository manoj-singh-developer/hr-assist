(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Department', Department);

  function Department($resource, apiUrl, alertService, errorService) {

    function Department() {}


    var url = '';
    let promise = null;
    let resource = null;
    let model = 'Department';


    Department.save = (data) => {
      url = apiUrl + '/departments/new';
      resource = $resource(url, {}, {
        'query': {
          method: 'POST'
        }
      }).query(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          return data;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveJson');
        });

      return promise;
    };

    Department.update = (data) => {
      url = apiUrl + '/departments/:id';
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


    Department.getById = (id) => {
      url = apiUrl + '/departments/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getById');
        });

      return promise;
    };


    Department.getAll = () => {
      url = apiUrl + '/departments';
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

    Department.remove = (id) => {
      url = apiUrl + '/departments/:id/';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove');
          return error.data;
        });

      return promise;
    };


    return Department;
  }

})();

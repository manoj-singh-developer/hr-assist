(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('AppType', AppType);

  AppType
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function AppType($resource, apiUrl, alertService) {

    function AppType() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Application type';


    AppType.save = (data) => {
      url = apiUrl + '/application_types/new';
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

    AppType.saveJson = (data) => {
      url = apiUrl + '/application_types/new';
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

    AppType.update = (data) => {
      url = apiUrl + '/application_types/:id';
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

    AppType.getById = (id) => {
      url = apiUrl + '/application_types/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

      return promise;
    };

    AppType.getAll = () => {
      url = apiUrl + '/application_types';
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

    AppType.remove = (id) => {
      url = apiUrl + '/application_types/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    return AppType;

  }

})();

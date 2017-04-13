(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Position', Position);

  Position
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function Position($resource, apiUrl, alertService) {

    function Position() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Position';


    Position.save = (data) => {
      url = apiUrl + '/positions/new';
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

    Position.saveJson = (data) => {
      url = apiUrl + '/positions/new';
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

    Position.update = (data) => {
      url = apiUrl + '/positions/:id';
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

    Position.getById = (id) => {
      url = apiUrl + '/positions/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

      return promise;
    };

    Position.getAll = () => {
      url = apiUrl + '/positions';
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

    Position.remove = (id) => {
      url = apiUrl + '/positions/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    return Position;

  }

})();

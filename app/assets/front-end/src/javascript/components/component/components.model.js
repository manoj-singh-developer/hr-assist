(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Component', Component);

  function Component($resource, apiUrl, alertService, errorService) {

    function Component() {}


    var url = '';
    let promise = null;
    let resource = null;
    let model = 'Component';


    Component.save = (data) => {
      url = apiUrl + '/components/new';
      resource = $resource(url, {}, {
        'query': {
          method: 'POST',
          isArray: true
        }
      }).query(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          //horrible hack to parse the array with one element
          let object = { "name": data[0] }
          return object;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveJson');
        });

      return promise;
    };

    Component.update = (data) => {
      url = apiUrl + '/components/:id';
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


    Component.getById = (id) => {
      url = apiUrl + '/components/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getById');
        });

      return promise;
    };


    Component.getAll = () => {
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

    Component.remove = (id) => {
      url = apiUrl + '/components/:id/';
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


    return Component;
  }

})();

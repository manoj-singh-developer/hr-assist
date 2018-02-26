(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Industry', Industry);

  Industry
    .$inject = ['$resource', 'apiUrl', 'alertService', 'errorService'];

  function Industry($resource, apiUrl, alertService, errorService) {

    function Industry() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Industry';


    Industry.save = (data) => {
      url = apiUrl + '/industries/new';
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

    Industry.saveJson = (data) => {
      url = apiUrl + '/industries/new';
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

    Industry.update = (data) => {
      url = apiUrl + '/industries/:id';
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

    Industry.getById = (id) => {
      url = apiUrl + '/industries/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          errorService.forceLogout(error);
          //alertService.error(model, 'getById');
        });

      return promise;
    };

    Industry.getAll = () => {
      url = apiUrl + '/industries';
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
          //alertService.error(model, 'getAll');
        });

      return promise;
    };

    Industry.remove = (id) => {
      url = apiUrl + '/industries/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove');
        });

      return promise;
    };

    return Industry;

  }

})();

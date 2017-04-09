(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Customer', Customer);

  Customer
    .$inject = ['$resource', 'apiUrl', 'alertService'];

  function Customer($resource, apiUrl, alertService) {

    function Customer() {}


    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Customer';


    Customer.save = (data) => {
      url = apiUrl + '/customers/new';
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

    Customer.saveJson = (data) => {
      url = apiUrl + '/customers/new';
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

    Customer.update = (data) => {
      url = apiUrl + '/customers/:id';
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

    Customer.getById = (id) => {
      url = apiUrl + '/customers/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

      return promise;
    };

    Customer.getAll = () => {
      url = apiUrl + '/customers';
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

    // TODO: add and end point to api for this
    Customer.remove = (id) => {
      url = apiUrl + '/customers/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    return Customer;

  }

})();

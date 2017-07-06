(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Candidate', Candidate);


  function Candidate($resource, apiUrl, alertService, $stateParams, errorService, $httpParamSerializerJQLike) {

    function Candidate() {}

    let url = '';
    let promise = null;
    let resource = null;
    let model = 'User';


    Candidate.save = (data) => {
      url = apiUrl + '/users/new';
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
          alertService.error(model, 'save')
        });

      return promise;
    };

    Candidate.update = (data) => {
      url = apiUrl + '/users/:id';
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
          alertService.error(model, 'update')
        });

      return promise;
    };

    Candidate.getById = (id) => {
      url = apiUrl + '/users/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          alertService.error(model, 'getById');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
      return promise;
    };

    Candidate.getAll = () => {
      url = apiUrl + '/candidates';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          alertService.error(model, 'getAll');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    Candidate.remove = (id) => {
      url = apiUrl + '/users/:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove')
        });

      return promise;
    };

    return Candidate;

  }

})();

(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Candidate', Candidate);


  function Candidate($resource, apiUrl, alertService, errorService, Upload) {

    function Candidate() {}

    let url = '';
    let promise = null;
    let resource = null;
    let model = 'User';


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
        });

      return promise;
    };

    Candidate.save = (data) => {
      url = apiUrl + '/candidates/new';

      promise = Upload.upload({
        url: url,
        data: data
      });
      promise.then((response) => {
        return response.data;
        alertService.success(model, 'save');
      }, (error) => {
        errorService.forceLogout(error);
        alertService.error(model, 'save')
        console.log('Error status: ' + error.status);
      });
      return promise;
    };

    Candidate.update = (data) => {
      url = apiUrl + '/candidates/:id';
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

    return Candidate;

  }

})();

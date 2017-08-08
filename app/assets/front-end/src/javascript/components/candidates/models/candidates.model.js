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
    let model = 'Candidate';


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

      promise.then((data) => {
        alertService.success(model, 'save');
        return data;
      }, (error) => {
        errorService.forceLogout(error);
        alertService.error(model, 'save')
        console.log('Error status: ' + error.status);
      });
      return promise;
    };

    Candidate.update = (data) => {
      url = apiUrl + '/candidates/' + data.id;
      resource = Upload.upload({
        url: url,
        data: data,
        method: 'PUT'
      });

      promise = resource
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

    Candidate.remove = (data) => {
      url = apiUrl + '/candidates/:id';
      resource = $resource(url).delete({ id: data.id });

      promise = resource.$promise
        .then(() => {
          alertService.success(model, 'remove');

        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove')
        });

      return promise;
    };

    Candidate.removeTechnologies = (candidate, technologies) => {
      let data = {};
      data["technology_ids[]"] = technologies;
      url = apiUrl + '/candidates/:id/technologies';
      resource = $resource(url, data).delete({ id: candidate.id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeTechnologies');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeTechnologies')
        });

      return promise;
    };

    Candidate.removeFiles = (candidate, files) => {
      let data = {};
      data["file_ids[]"] = files;
      url = apiUrl + '/candidates/:id/files';
      resource = $resource(url, data).delete({ id: candidate.id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeFiles');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeFiles')
        });

      return promise;
    };

    return Candidate;

  }

})();

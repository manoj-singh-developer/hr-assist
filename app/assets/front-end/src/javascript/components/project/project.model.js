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

    Project.getAll = () => {
      url = apiUrl + '/projects?with[]=application_types&with[]=activities&with[]=industries&with[]=technologies&with[]=customers&with[]=users';
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

    Project.getById = (id) => {
      url = apiUrl + '/projects/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getById'));

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


    Project.saveTechnologies = (project, technologies) => {
      let id = project.id;
      let data = {};

      data.technology_ids = technologies.map(technology => technology.id);
      url = apiUrl + '/projects/:id/technologies';

      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateTechnologies');
          return data.technologies;
        }).catch(() => alertService.error(model, 'updateTechnologies'));

      return promise;
    };

    Project.getTechnologies = (project) => {
      let id = project.id;
      url = apiUrl + '/projects/:id/technologies';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getTechnologies'));

      return promise;
    };

    Project.removeTechnologies = (project, technologies) => {
      let id = project.id;
      let data = {};

      data.technology_ids = technologies.map(technology => technology.id);
      url = apiUrl + '/projects/:id/technologies';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateTechnologies');
          return data.technologies;
        }).catch(() => alertService.error(model, 'updateTechnologies'));

      return promise;
    };


    Project.saveIndustries = (project, industries) => {
      let id = project.id;
      let data = {};

      data.industry_ids = industries.map(industry => industry.id);
      url = apiUrl + '/projects/:id/industries';

      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateIndustries');
          return data.technologies;
        }).catch(() => alertService.error(model, 'updateIndustries'));

      return promise;
    };

    Project.getIndustries = (project) => {
      let id = project.id;
      url = apiUrl + '/projects/:id/industries';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getIndustries'));

      return promise;
    };

    Project.removeTechnologies = (project, technologies) => {
      let id = project.id;
      let data = {};

      data.technology_ids = technologies.map(technology => technology.id);
      url = apiUrl + '/projects/:id/technologies';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateTechnologies');
          return data.technologies;
        }).catch(() => alertService.error(model, 'updateTechnologies'));

      return promise;
    };

    return Project;

  }

})();

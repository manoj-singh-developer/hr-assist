(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('Project', Project);

  Project
    .$inject = ['$resource', 'apiUrl', 'alertService', 'errorService'];

  function Project($resource, apiUrl, alertService, errorService) {

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
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'save');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getAll');
        });

      return promise;
    };

    Project.getById = (id) => {
      url = apiUrl + '/projects/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getById');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getEmployees');
        });

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
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateTechnologies');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getTechnologies');
        });

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
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateTechnologies');
        });

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
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateIndustries');
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getIndustries');
        });

      return promise;
    };

    Project.removeTechnologies = (project, technologies) => {
      let id = project.id;
      let data = {};

      data["technology_ids[]"] = technologies.map(technology => technology.id);
      url = apiUrl + '/projects/:id/technologies';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove technology');
          return data.technologies;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove technology');
        });

      return promise;
    };

    Project.removeIndustries = (project, industries) => {
      let id = project.id;
      let data = {};

      data["industry_ids[]"] = industries.map(industry => industry.id);
      url = apiUrl + '/projects/:id/industries';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove industry');
          return data.technologies;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove industry');
        });

      return promise;
    }

    Project.getCustomers = (project) => {
      let id = project.id;
      url = apiUrl + '/projects/:id/customers';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'get customers');
        });

      return promise;
    }

    Project.saveCustomers = (project, customers) => {
      let id = project.id;
      let data = {};
      data.customer_ids = customers.map(customer => customer.id);
      url = apiUrl + '/projects/:id/customers';

      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update customers');
          return data.customers;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update customers');
        });

      return promise;
    }

    Project.removeCustomers = (project, customers) => {
      let id = project.id;
      let data = {};

      data["customer_ids[]"] = customers.map(customer => customer.id);
      url = apiUrl + '/projects/:id/customers';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove customer');
          return data.customers;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove customer');
        });

      return promise;
    }

    Project.getAppTypes = (project) => {
      let id = project.id;
      url = apiUrl + '/projects/:id/application_types';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'get appTypes');
        });

      return promise;
    }

    Project.saveAppTypes = (project, appTypes) => {
      let id = project.id;
      let data = {};
      data.application_type_ids = appTypes.map(appType => appType.id);
      url = apiUrl + '/projects/:id/application_types';

      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update appTypes');
          return data.application_types;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update appTypes');
        });

      return promise;
    }

    Project.removeAppTypes = (project, appTypes) => {
      let id = project.id;
      let data = {};

      data["application_type_ids[]"] = appTypes.map(appType => appType.id);
      url = apiUrl + '/projects/:id/application_types';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove appType');
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove appType');
        });

      return promise;
    }

    Project.getUsers = (project) => {
      let id = project.id;
      url = apiUrl + '/projects/:id/users';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getUsers');
        });

      return promise;
    };

    Project.saveUsers = (project, users) => {
      let id = project.id;
      let data = users;
      url = apiUrl + '/projects/:id/users';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update users');
          return data.application_types;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update users');
        });

      return promise;
    }

    Project.removeUsers = (project, users) => {
      let id = project.id;
      let data = {};
      if (users.usersToRemove) {
        data['user_ids[]'] = users.usersToRemove;
      };
      
      if (users.team_leader_id) {
        data['team_leader_id']= users.team_leader_id;
      };

      url = apiUrl + '/projects/:id/users';
      resource = $resource(url, data).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove user');
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove user');
        });

      return promise;
    }

    return Project;

  }

})();

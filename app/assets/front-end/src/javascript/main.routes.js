/*jshint esversion: 6 */

const rootTemplatePath = './views/components/';

(function() {

  'use strict';

  angular.module('routes', [
    'ui.router',
    'ngResource',

    'permission',
    'permission.ui'
  ]);

  angular.module('routes').config(setConfig);
  angular.module('routes').run(setRoles);


  setConfig
    .$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdDateLocaleProvider'];

  function setConfig($stateProvider, $urlRouterProvider, $httpProvider, $mdDateLocaleProvider) {

    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.formatDate = function() {

      let date = new Date();
      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();

      return day + '/' + (monthIndex + 1) + '/' + year;

    };

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
      .state('landing-page', {
        url: '/',
        templateUrl: rootTemplatePath + 'landing/views/landing.view.html',
        name: 'landing',
        data: {
          cssClassNames: 'view-landing'
        },
        resolve: {
          controller: function ($location, tokenService) {
            if(localStorage.auth_token &&
              window.location.href === 'http://localhost:8000/#/' ||
              window.location.href === 'http://localhost:8000' ||
              window.location.href === 'https://hr.assist.ro/' ||
              window.location.href === 'https://hr.assist.ro/#/') {

              var tokenToDecode = localStorage.getItem('user_token');
              var decodeToken = tokenService.decodeToken(tokenToDecode);
              var userId  = decodeToken.user_id;

              $location.path("employees/" + userId);
            }
          }
        }
      })
      // @DASHBOARD
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: rootTemplatePath + 'dashboard/views/dashboard.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-dashboard'
        }
      })
      // @EMPLOYEES
      .state('employeesParent', {
        url: '/employees',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('employeesParent.list', {
        url: '/list',
        template: '<hra-employees md-whiteframe="6"></hra-employees>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employees'
        }
      })
      .state('employeesParent.details', {
        url: '/:id',
        template: '<hra-user-details></hra-user-details>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-user-details'
        }
      })
      .state('employeesParent.cv', {
        url: '/:id/cv',
        template: '<hra-employee-cv></hra-employee-cv>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employee-cv'
        }
      })
      .state('employeesParent.holiday', {
        url: '/:id/holiday/:holidayIndex',
        template: '<hra-employee-holiday-preview></hra-employee-holiday-preview>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employee-holidays'
        }
      })
      // @HOLIDAYS
      .state('holidayParent', {
        url: '/holidays',
        templateUrl: rootTemplatePath + 'holiday/views/holidayParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('holidayParent.list', {
        url: '/list',
        template: '<hra-holidays></hra-holidays>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-holidays'
        }
      })
      .state('holidayParent.details', {
        url: '/:id',
        template: '<hra-holiday-details></hra-holiday-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-holidays-details'
        }
      })
      // @PROJECTS
      .state('projectsParent', {
        url: '/projects',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('projectsParent.list', {
        url: '/list',
        template: '<hra-projects md-whiteframe="6"></hra-projects>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-projects'
        }
      })
      .state('projectsParent.details', {
        url: '/:id',
        template: '<hra-project-details></hra-project-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-project-details'
        }
      })
      // @TECHNOLOGIES
      .state('technologyParent', {
        url: '/technologies',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('technologyParent.list', {
        url: '/list',
        template: '<hra-technologies></hra-technologies>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-skills'
        }
      })
      .state('technologyParent.details', {
        url: '/:id',
        template: '<hra-technologies-details></hra-technologies-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-skills-details'
        }
      })
      // @Devices
      .state('deviceParent', {
        url: '/devices',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('deviceParent.list', {
        url: '/list',
        template: '<hra-devices md-whiteframe="6"></hra-devices>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-devices'
        }
      })
      .state('deviceParent.details', {
        url: '/:id',
        template: '<hra-device-details></hra-device-detail>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-device-details'
        }
      })
      // @CANDIDATES
      .state('candidateParent', {
        url: '/candidate',
        templateUrl: rootTemplatePath + 'employee/views/employeesParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('candidateParent.list', {
        url: '/list',
        template: '<hra-employees md-whiteframe="6" candidate=true></hra-employees>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidates'
        }
      })
      .state('candidateParent.details', {
        url: '/:id',
        template: '<hra-employee-details candidate=true></hra-employee-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidate-details'
        }
      })
      .state('candidateParent.cv', {
        url: '/:id/cv',
        template: '<hra-employee-cv candidate=true></hra-employee-cv>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidate-cv'
        }
      })
      // EXTRA
      .state('extraParent', {
        url: '/extra',
        templateUrl: rootTemplatePath + 'extra/views/extraParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('extraParent.list', {
        url: '/list',
        template: '<hra-extra-list md-whiteframe="6"></hra-extra-list>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-extras'
        }
      })
      // @INDUSTRIES
      .state('industryParent', {
        url: '/industries',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('industryParent.list', {
        url: '/list',
        template: '<hra-industries></hra-industries>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-industries'
        }
      })
      // @CUSTOMERS
      .state('customerParent', {
        url: '/customers',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('customerParent.list', {
        url: '/list',
        template: '<hra-customers></hra-customers>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-customers'
        }
      })
      // @APP TYPES
      .state('appTypeParent', {
        url: '/appTypes',
        template: '<section ui-view></section>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('appTypeParent.list', {
        url: '/list',
        template: '<hra-app-types></hra-app-types>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-app-types'
        }
      })
      // @LOGIN
      .state('login', {
        url: '/login',
        templateUrl: rootTemplatePath + 'login/views/login.view.html',
        data: {
          permissions: {
            only: ['isAnonymous'],
            except: ['ADMIN', 'EMPLOYEE'],
            redirectTo: getCurrentState
          },
          cssClassNames: 'view-login'
        }
      })
      // @LOGOUT
      .state('logout', {
        url: '/logout',
        resolve: {
          removeRoles: removeToken
        },
        data: {
          cssClassNames: 'view-logout'
        }
      });

    if ( /*@cc_on!@*/ false || !!document.documentMode) {
      var $common = $httpProvider.defaults.headers.common;
      $common['Cache-Control'] = 'no-cache';
      $common.Pragma = 'no-cache';
      $common['If-Modified-Since'] = '0';
    }

  }


  setRoles
    .$inject = ['PermPermissionStore', 'PermRoleStore'];

  function setRoles(PermPermissionStore, PermRoleStore) {

    PermRoleStore.defineManyRoles({
      'EMPLOYEE': ['seeOwnProfileOnly'],
      'ADMIN': ['seeEverything']
    });

    PermPermissionStore
      .definePermission('isLoggedIn', isLoggedIn);

    PermPermissionStore
      .definePermission('isAnonymous', isAnonymous);

    PermPermissionStore
      .definePermission('seeOwnProfileOnly', seeOwnProfileOnly);

    PermPermissionStore
      .definePermission('seeEverything', seeEverything);

  }


  // If user is looged in
  isLoggedIn
    .$inject = ['tokenService'];

  function isLoggedIn(tokenService) {
    var token = tokenService.getToken('user_token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }


  // Permission for LOGGED OUT ONLY
  isAnonymous
    .$inject = ['tokenService'];

  function isAnonymous(tokenService) {
    var token = tokenService.getToken('user_token');
    if (!token) {
      return true;
    } else {
      return false;
    }
  }


  // Permission for EMPLOYEES ONLY
  seeOwnProfileOnly
    .$inject = ['tokenService', '$rootScope', 'transitionProperties'];

  function seeOwnProfileOnly(tokenService, $rootScope, transitionProperties) {
    var token = tokenService.getToken('user_token');
    var decodeToken = tokenService.decodeToken(token);

    var userIdApi = ''; // user id that comes from api
    var userIdTransition = ''; // user id from state params
    var isHisProfie = null;
    var isEmployee = null;

    if (decodeToken) {
      userIdApi = parseInt(decodeToken.user_id);
      userIdTransition = parseInt(transitionProperties.toParams.id);

      // [ userIdApi ] and [ userIdTransition ] should be the same
      // in order to PREVENT an Employee
      // to access other Employee profile
      // ONLY ADMIN can access all profiles
      isHisProfie = (userIdApi === userIdTransition);
      isEmployee = (decodeToken.role_id === 2);

      if (isHisProfie && isEmployee) {
        toggleMenuClassesFor('EMPLOYEE');
        $rootScope.isAdmin = false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  // Permission for ADMIN ONLY
  seeEverything
    .$inject = ['tokenService', '$rootScope'];

  function seeEverything(tokenService, $rootScope) {
    var token = tokenService.getToken('user_token');
    var decodeToken = tokenService.decodeToken(token);

    if (decodeToken && decodeToken.role_id === 1) {
      toggleMenuClassesFor('ADMIN');
      $rootScope.isAdmin = true;
      return true;
    } else {
      return false;
    }
  }


  // Removing Token.
  removeToken
    .$inject = ['$timeout', '$state', 'PermRoleStore', 'tokenService'];

  function removeToken($timeout, $state, PermRoleStore, tokenService) {
    // Removing token / Set an empty one
    tokenService.setAuthToken();

    // Redirecting to login
    $timeout(function() {
      $state.go('login');
    }, 1);
  }


  // Toggle menu extra classes for ADMIN or EMPLOYEE
  function toggleMenuClassesFor(menuType) {
    var $body = angular.element(document.getElementsByTagName('body'));

    if (menuType === 'ADMIN') {
      $body.removeClass('pages-employee pages-admin');
      $body.addClass('pages-admin');
    } else if (menuType === 'EMPLOYEE') {
      $body.removeClass('pages-employee pages-admin');
      $body.addClass('pages-employee');
    }
  }


  getCurrentState
    .$inject = ['$state'];

  function getCurrentState($state) {
    if ($state.current.name) {
      return $state.current.name;
    } else {
      $state.current.name = 'logout';
      $state.go('logout');
      return null;
    }
  }

}());

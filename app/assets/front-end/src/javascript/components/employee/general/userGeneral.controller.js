(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('userGeneralCtrl', userGeneralCtrl);

  userGeneralCtrl

  function userGeneralCtrl($rootScope, $scope, $stateParams, autocompleteService, Upload, User, Position, $state, dateService, $http) {

    let vm = this;
    let userCopy = {};
    let positionCopy = {};
    let scheduleCopy = {};
    let technologiesString = '';
    let Education = [];
    let userImage = '';

    vm.today = new Date();
    vm.isAdmin = false;
    vm.user = {};
    vm.position = {};
    vm.schedule = {};
    vm.dateService = dateService;
    vm.contractType = [
      'Full-time',
      'Part-time 4h',
      'Part-time 6h'
    ];

    vm.save = save;
    vm.savePosition = savePosition;
    vm.saveSchedule = saveSchedule;
    vm.saveCopy = saveCopy;
    vm.cancel = cancel;
    vm.userLogOut = userLogOut;
    vm.generateCv = generateCv;

    _getPositions();

    if ($rootScope.isAdmin === true) {
      vm.isAdmin = true;
    } else {
      vm.isAdmin = false;
    }

    $rootScope.$on('event:userResourcesLoaded', function(event, resources) {
      vm.user = resources.user;
      vm.education = resources.educations;
      vm.technologies = resources.userTechnologies;

      saveCopy();
      _getUserPosition();
      _getTechnologiesArr();
      _getEducation();
      _getBase64ImageUrl(_getGravatar(vm.user.email, 100));

    });

    $rootScope.$on('loadUserSchedule', (event, data) => {
      vm.schedule = data;
    });

    $rootScope.$on('notifyScheduleUpdate', (event, data) => {
      _getUserSchedule();
    });

    function save() {
      vm.user.company_start_date = vm.user.company_start_date ? vm.dateService.format(vm.user.company_start_date) : null;
      vm.user.birthday = vm.user.birthday ? vm.dateService.format(vm.user.birthday) : null;
      User.update(vm.user).then((data) => {
        if (data) {
          vm.user = data;
          vm.users

        } else {
          _getUser();
        }
        vm.toggleForm();
      });
    }

    function saveCopy() {
      userCopy = angular.copy(vm.user);
      positionCopy = angular.copy(vm.position);
      scheduleCopy = angular.copy(vm.schedule);
    }

    function cancel() {
      vm.user = angular.copy(userCopy);
      vm.position = angular.copy(positionCopy);
      vm.schedule = angular.copy(scheduleCopy);
    }

    function savePosition() {
      User.updatePosition(vm.user, vm.position).then((data) => {
        vm.position = data;
      });
    }

    function saveSchedule() {
      // TODO: add functionality here
    }

    function userLogOut() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_token');

      $state.reload();
    }

    function generateCv() {

      let objectToGenerate = {
        'SkillsPassport': {
          'Locale': 'en',
          'DocumentInfo': {
            'DocumentType': 'ECV',
            'CreationDate': new Date(),
            'LastUpdateDate': new Date(),
            'XSDVersion': 'V3.0',
            'Generator': 'REST_WS',
            'Comment': 'Europass CV'
          },
          'LearnerInfo': {
            'Identification': {
              'PersonName': {
                'FirstName': vm.user.first_name,
                'Surname': vm.user.last_name
              },
              'ContactInfo': {
                'Address': {
                  'Contact': {
                    'AddressLine': vm.user.address,
                    'PostalCode': vm.user.zip_code,
                    'Municipality': vm.user.city,
                    'Country': {
                      'Code': 'RO',
                      'Label': 'Romanian'
                    }
                  }
                },
                'Email': {
                  'Contact': vm.user.email
                },
                'Telephone': [{
                  'Contact': vm.user.phone,
                  'Use': {
                    'Code': 'mobile',
                    'Label': 'Mobile'
                  }
                }],

              },
              'Demographics': {
                'Birthdate': {
                  'Year': new Date(vm.user.birthday).getFullYear(),
                  'Month': new Date(vm.user.birthday).getMonth() + 1,
                  'Day': new Date(vm.user.birthday).getDate()
                }
              },
              'Photo': {
                'MimeType': 'image/jpeg',
                'Data': userImage,
                'Metadata': [{
                  'Key': 'dimension',
                  'Value': '100x100'
                }, {
                  'Key': 'number-of-pages',
                  'Value': '5'
                }]
              }
            },
            'Headline': {
              'Type': {
                'Code': 'job_applied_for',
                'Label': 'JOB APPLIED FOR'
              },
              'Description': {
                'Label': ' This field must be created (Description of job applied)'
              }
            },
            'WorkExperience': [{
              'Period': {
                'From': {
                  'Year': new Date(vm.user.company_start_date).getFullYear(),
                  'Month': new Date(vm.user.company_start_date).getMonth()
                },
                'Current': true
              },
              'Position': {
                'Label': vm.position.name
              },
              'Activities': 'This field must be created (Activities at this job)',
              'Employer': {
                'Name': 'Assist Software',
                'ContactInfo': {
                  'Address': {
                    'Contact': {
                      'AddressLine': 'nr. 1, Tipografiei Street',
                      'PostalCode': '720043',
                      'Municipality': 'Suceava',
                      'Country': {
                        'Code': 'RO',
                        'Label': 'Romania'
                      }
                    }
                  }
                }
              }
            }],
            'Education': Education,
            'Skills': {
              'Linguistic': {
                'MotherTongue': [{
                  'Description': {
                    'Code': 'RO',
                    'Label': 'Romana'
                  }
                }],
                'ForeignLanguage': [{
                  'Description': {
                    'Code': 'en',
                    'Label': 'English'
                  },
                  'ProficiencyLevel': {
                    'Listening': 'C1 (Hardcoded Value)',
                    'Reading': 'C2 (Hardcoded Value)',
                    'SpokenInteraction': 'B2 (Hardcoded Value)',
                    'SpokenProduction': 'C1 (Hardcoded Value)',
                    'Writing': 'C2 (Hardcoded Value)'
                  },
                  'Certificate': [{
                    'Title': 'This field must be created (Language Certificate)'
                  }]
                }, {
                  'Description': {
                    'Code': 'fr',
                    'Label': 'French'
                  },
                  'ProficiencyLevel': {
                    'Listening': 'A2 (Hardcoded Value)',
                    'Reading': 'A2 (Hardcoded Value)',
                    'SpokenInteraction': 'A2 (Hardcoded Value)',
                    'SpokenProduction': 'A2 (Hardcoded Value)',
                    'Writing': 'A2 (Hardcoded Value)'
                  },
                  'Certificate': [{
                    'Title': 'This field must be created (Language Certificate)'
                  }]
                }]
              },
              'Communication': {
                'Description': 'This field must be created (Communication slills, short description how we achieve this skill)'
              },
              'Organisational': {
                'Description': '- This field must be created <br />(Organisational skills) <br />- (how we achieve this skill)'
              },
              'Computer': {
                'Description': '- competent with most Microsoft Office programmes (This field must be created) <br />- experience with HTML (Hardcoded Value)'
              },
              'Driving': {
                'Description': ['A', 'B', '(Hardcoded Value)']
              },
              'Other': {
                'Description': 'Good Skills in ' + technologiesString + '.'
              }
            },
            'Achievement': [{
              'Title': {
                'Code': 'publications',
                'Label': 'Publications'
              },
              'Description': 'ă-Ă-â-Â-î-Î-ș-Ș-ț-Ț TEST Diacritice How to do Observations: Borrowing techniques from the Social Sciences to help Participants do Observations in Simulation Exercisesâ€™ Coyote EU/CoE Partnership Publication, (2002) (Hardcoded Value).'
            }]
          }
        }
      }

      // Useful links about Europass REST API
      // http://interop.europass.cedefop.europa.eu/data-model/json-resources/v3.3.0/schema/europass-json-schema-v3.3.0.json
      // http://interop.europass.cedefop.europa.eu/web-services/rest-api-reference/common/examples/files-in/cv-in.json
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _getPdf(objectToGenerate);

      function _getPdf(pdfData) {

        $http({
          url: 'https://europass.cedefop.europa.eu/rest/v1/document/to/pdf-cv',
          method: 'POST',
          data: pdfData, // json data string
          responseType: 'arraybuffer'
        }).success(function(data, status, headers, config) {

          let ieEDGE = navigator.userAgent.match(/Edge/g);
          let ie = navigator.userAgent.match(/.NET/g); // IE 11+
          let oldIE = navigator.userAgent.match(/MSIE/g);
          let name = 'CV_' + vm.user.first_name + '_' + vm.user.last_name;
          let blob = new window.Blob([data], { type: 'application/pdf' });
          // debugger
          if (ie || oldIE || ieEDGE) {
            let fileName = name + '.pdf';
            window.navigator.msSaveBlob(blob, fileName);
          } else {
            let file = new Blob([data], {
              type: 'application/pdf'
            });
            let fileURL = URL.createObjectURL(file);
            let a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = name + '.pdf';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(file);
          }

        });

      }
    }

    function _getPositions() {
      Position.getAll().then(data => vm.positions = data);
    }

    function _getUser() {
      User.getById($stateParams.id).then(data => vm.user = data);
    }

    // We can chain the following two promises
    function _getUserPosition() {
      User.getPosition(vm.user).then((data) => {
        vm.position = data;
        saveCopy();
      });
    }

    function _getUserSchedule() {
      User.getSchedule(vm.user).then((data) => {
        vm.schedule = data;
        saveCopy();
      });
    }

    // FOR CV GENERATOR FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function _getTechnologiesArr() {
      let technologiesArr = $.map(vm.technologies, (elem, index) => {
        return [elem.name];
      });
      technologiesString = technologiesArr.join(', ');
    }

    function _getEducation() {
      for (let i = 0; i < vm.education.length; i++) {
        let edObj = {};
        edObj.Period = {};
        edObj.Period.From = {};
        edObj.Period.To = {};
        edObj.Organisation = {};
        edObj.Organisation.ContactInfo = {};
        edObj.Organisation.ContactInfo.Address = {};
        edObj.Organisation.ContactInfo.Address.Contact = {};
        edObj.Organisation.ContactInfo.Address.Contact.Country = {};


        edObj.Period.From.Year = new Date(vm.education[i].start_date).getFullYear();
        edObj.Period.To.Year = new Date(vm.education[i].end_date).getFullYear();
        edObj.Title = vm.education[i].degree;
        edObj.Organisation.Name = vm.education[i].name;
        edObj.Organisation.ContactInfo.Address.Contact.Municipality = 'Suceava (missing field at education)';
        edObj.Organisation.ContactInfo.Address.Contact.Country.Code = 'RO (field at education)';
        edObj.Organisation.ContactInfo.Address.Contact.Country.Label = 'Romania (missing field at education)';

        Education.push(edObj);
      }

      Education.sort((a, b) => {
        return b.Period.To.Year - a.Period.To.Year;
      });

      return Education;
    }

    function _getGravatar(email, size) {

      // MD5 (Message-Digest Algorithm) by WebToolkit
      // can be install angular-md5, or make MD5 function a service?
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let MD5 = function(s) {
        function L(k, d) {
          return (k << d) | (k >>> (32 - d))
        }

        function K(G, k) {
          let I, d, F, H, x;
          F = (G & 2147483648);
          H = (k & 2147483648);
          I = (G & 1073741824);
          d = (k & 1073741824);
          x = (G & 1073741823) + (k & 1073741823);
          if (I & d) {
            return (x ^ 2147483648 ^ F ^ H)
          }
          if (I | d) {
            if (x & 1073741824) {
              return (x ^ 3221225472 ^ F ^ H)
            } else {
              return (x ^ 1073741824 ^ F ^ H)
            }
          } else {
            return (x ^ F ^ H)
          }
        }

        function r(d, F, k) {
          return (d & F) | ((~d) & k)
        }

        function q(d, F, k) {
          return (d & k) | (F & (~k))
        }

        function p(d, F, k) {
          return (d ^ F ^ k)
        }

        function n(d, F, k) {
          return (F ^ (d | (~k)))
        }

        function u(G, F, aa, Z, k, H, I) {
          G = K(G, K(K(r(F, aa, Z), k), I));
          return K(L(G, H), F)
        }

        function f(G, F, aa, Z, k, H, I) {
          G = K(G, K(K(q(F, aa, Z), k), I));
          return K(L(G, H), F)
        }

        function D(G, F, aa, Z, k, H, I) {
          G = K(G, K(K(p(F, aa, Z), k), I));
          return K(L(G, H), F)
        }

        function t(G, F, aa, Z, k, H, I) {
          G = K(G, K(K(n(F, aa, Z), k), I));
          return K(L(G, H), F)
        }

        function e(G) {
          let Z;
          let F = G.length;
          let x = F + 8;
          let k = (x - (x % 64)) / 64;
          let I = (k + 1) * 16;
          let aa = Array(I - 1);
          let d = 0;
          let H = 0;
          while (H < F) {
            Z = (H - (H % 4)) / 4;
            d = (H % 4) * 8;
            aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
            H++
          }
          Z = (H - (H % 4)) / 4;
          d = (H % 4) * 8;
          aa[Z] = aa[Z] | (128 << d);
          aa[I - 2] = F << 3;
          aa[I - 1] = F >>> 29;
          return aa
        }

        function B(x) {
          let k = "",
            F = "",
            G, d;
          for (d = 0; d <= 3; d++) {
            G = (x >>> (d * 8)) & 255;
            F = "0" + G.toString(16);
            k = k + F.substr(F.length - 2, 2)
          }
          return k
        }

        function J(k) {
          k = k.replace(/rn/g, "n");
          let d = "";
          for (let F = 0; F < k.length; F++) {
            let x = k.charCodeAt(F);
            if (x < 128) { d += String.fromCharCode(x) } else {
              if ((x > 127) && (x < 2048)) {
                d += String.fromCharCode((x >> 6) | 192);
                d += String.fromCharCode((x & 63) | 128)
              } else {
                d += String.fromCharCode((x >> 12) | 224);
                d += String.fromCharCode(((x >> 6) & 63) | 128);
                d += String.fromCharCode((x & 63) | 128)
              }
            }
          }
          return d
        }
        let C = Array();
        let P, h, E, v, g, Y, X, W, V;
        let S = 7,
          Q = 12,
          N = 17,
          M = 22;
        let A = 5,
          z = 9,
          y = 14,
          w = 20;
        let o = 4,
          m = 11,
          l = 16,
          j = 23;
        let U = 6,
          T = 10,
          R = 15,
          O = 21;
        s = J(s);
        C = e(s);
        Y = 1732584193;
        X = 4023233417;
        W = 2562383102;
        V = 271733878;
        for (P = 0; P < C.length; P += 16) {
          h = Y;
          E = X;
          v = W;
          g = V;
          Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
          V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
          W = u(W, V, Y, X, C[P + 2], N, 606105819);
          X = u(X, W, V, Y, C[P + 3], M, 3250441966);
          Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
          V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
          W = u(W, V, Y, X, C[P + 6], N, 2821735955);
          X = u(X, W, V, Y, C[P + 7], M, 4249261313);
          Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
          V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
          W = u(W, V, Y, X, C[P + 10], N, 4294925233);
          X = u(X, W, V, Y, C[P + 11], M, 2304563134);
          Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
          V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
          W = u(W, V, Y, X, C[P + 14], N, 2792965006);
          X = u(X, W, V, Y, C[P + 15], M, 1236535329);
          Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
          V = f(V, Y, X, W, C[P + 6], z, 3225465664);
          W = f(W, V, Y, X, C[P + 11], y, 643717713);
          X = f(X, W, V, Y, C[P + 0], w, 3921069994);
          Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
          V = f(V, Y, X, W, C[P + 10], z, 38016083);
          W = f(W, V, Y, X, C[P + 15], y, 3634488961);
          X = f(X, W, V, Y, C[P + 4], w, 3889429448);
          Y = f(Y, X, W, V, C[P + 9], A, 568446438);
          V = f(V, Y, X, W, C[P + 14], z, 3275163606);
          W = f(W, V, Y, X, C[P + 3], y, 4107603335);
          X = f(X, W, V, Y, C[P + 8], w, 1163531501);
          Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
          V = f(V, Y, X, W, C[P + 2], z, 4243563512);
          W = f(W, V, Y, X, C[P + 7], y, 1735328473);
          X = f(X, W, V, Y, C[P + 12], w, 2368359562);
          Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
          V = D(V, Y, X, W, C[P + 8], m, 2272392833);
          W = D(W, V, Y, X, C[P + 11], l, 1839030562);
          X = D(X, W, V, Y, C[P + 14], j, 4259657740);
          Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
          V = D(V, Y, X, W, C[P + 4], m, 1272893353);
          W = D(W, V, Y, X, C[P + 7], l, 4139469664);
          X = D(X, W, V, Y, C[P + 10], j, 3200236656);
          Y = D(Y, X, W, V, C[P + 13], o, 681279174);
          V = D(V, Y, X, W, C[P + 0], m, 3936430074);
          W = D(W, V, Y, X, C[P + 3], l, 3572445317);
          X = D(X, W, V, Y, C[P + 6], j, 76029189);
          Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
          V = D(V, Y, X, W, C[P + 12], m, 3873151461);
          W = D(W, V, Y, X, C[P + 15], l, 530742520);
          X = D(X, W, V, Y, C[P + 2], j, 3299628645);
          Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
          V = t(V, Y, X, W, C[P + 7], T, 1126891415);
          W = t(W, V, Y, X, C[P + 14], R, 2878612391);
          X = t(X, W, V, Y, C[P + 5], O, 4237533241);
          Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
          V = t(V, Y, X, W, C[P + 3], T, 2399980690);
          W = t(W, V, Y, X, C[P + 10], R, 4293915773);
          X = t(X, W, V, Y, C[P + 1], O, 2240044497);
          Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
          V = t(V, Y, X, W, C[P + 15], T, 4264355552);
          W = t(W, V, Y, X, C[P + 6], R, 2734768916);
          X = t(X, W, V, Y, C[P + 13], O, 1309151649);
          Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
          V = t(V, Y, X, W, C[P + 11], T, 3174756917);
          W = t(W, V, Y, X, C[P + 2], R, 718787259);
          X = t(X, W, V, Y, C[P + 9], O, 3951481745);
          Y = K(Y, h);
          X = K(X, E);
          W = K(W, v);
          V = K(V, g)
        }
        let i = B(Y) + B(X) + B(W) + B(V);
        return i.toLowerCase()
      };

      var size = size || 100;

      return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
    }

    function _getBase64ImageUrl(url) {

      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        let dataURL = canvas.toDataURL("image/png");

        return userImage = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      };

      img.src = url;
    }

  }


})();

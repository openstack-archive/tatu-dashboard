/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname designatedashboard.resources.os-tatu-user.actions
   *
   * @description
   * Provides all of the actions for Tatu User Certs.
   */
  angular.module('tatudashboard.resources.os-tatu-user.actions', [
    'horizon.framework.conf',
    'horizon.app.core'
  ])
    .run(run);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-user.resourceType',
    'tatudashboard.resources.os-tatu-user.actions.create',
    'tatudashboard.resources.os-tatu-user.actions.revoke'
  ];

  function run(registry,
               resourceTypeString,
               createAction,
               revokeAction) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .globalActions
      .append({
        id: 'create',
        service: createAction,
        template: {
          text: gettext('Create User SSH Certificate')
        }
      });

    resourceType
      .itemActions
      .append({
        id: 'revoke',
        service: revokeAction,
        template: {
          text: gettext('Revoke'),
        }
      });
  }

})();

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
   * @ngname tatudashboard.resources.os-tatu-host.actions
   *
   * @description
   * Provides all of the actions for SSH hosts.
   */
  angular.module('tatudashboard.resources.os-tatu-host.actions', [
    'horizon.framework.conf',
    'horizon.app.core'
  ])
    .run(run);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-host.resourceType',
    'tatudashboard.resources.os-tatu-host.actions.create',
    'tatudashboard.resources.os-tatu-host.actions.delete',
    'tatudashboard.resources.os-tatu-host.actions.update'
  ];

  function run(registry,
               resourceTypeString,
               createAction,
               deleteAction,
               updateAction) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .globalActions
      .append({
        id: 'create',
        service: createAction,
        template: {
          text: gettext('Create host')
        }
      });

    resourceType
      .itemActions
      .append({
        id: 'update',
        service: updateAction,
        template: {
          text: gettext('Update')
        }
      })
      .append({
        id: 'delete',
        service: deleteAction,
        template: {
          text: gettext('Delete'),
          type: 'delete'
        }
      });
  }

})();

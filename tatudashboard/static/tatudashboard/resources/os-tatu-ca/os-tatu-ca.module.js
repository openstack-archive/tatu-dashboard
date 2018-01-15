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
   * @ngname tatudashboard.resources.os-tatu-host
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display SSH (Tatu) host related content.
   */
  angular
    .module('tatudashboard.resources.os-tatu-ca', [
      'ngRoute',
    ])
    .constant(
      'tatudashboard.resources.os-tatu-ca.resourceType', 'OS::Tatu::CA')
    .run(run);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-ca.api',
    'tatudashboard.resources.os-tatu-ca.resourceType',
    'tatudashboard.resources.util'
  ];

  function run(registry,
               caApi
               resourceTypeString,
               util) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH CA'), gettext('SSH CAs'))
      .setListFunction(listCAs)
      .setProperty('id', {
        label: gettext('CA ID')
      })
      .setProperty('host_pub_key', {
        label: gettext('Host Public Key'),
      })
      .setProperty('user_pub_key', {
        label: gettext('User Public Key'),
      });

    resourceType
      .tableColumns
      .append({
        id: 'id',
        priority: 1
      })
      .append({
        id: 'host_pub_key',
        priority: 2,
      })
      .append({
        id: 'user_pub_key',
        priority: 2,
      });


    function listCAs() {
      return caApi.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.CAs;

        util.addTimestampIds(response.data.items, 'updated_at');

        return response;
      });
    }
  }

})();

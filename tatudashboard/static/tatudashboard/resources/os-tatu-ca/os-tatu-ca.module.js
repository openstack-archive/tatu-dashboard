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
      'ngRoute'
    ])
    .constant(
      'tatudashboard.resources.os-tatu-ca.resourceType', 'OS::Tatu::CA')
    .config(config)
    .run(run);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/resources/os-tatu-ca/';
    $provide.constant('tatudashboard.resources.os-tatu-ca.basePath', path);
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-ca.api',
    'tatudashboard.resources.os-tatu-ca.resourceType',
    'tatudashboard.resources.util'
  ];

  function run(registry,
               caApi,
               resourceTypeString,
               util) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH CA'), gettext('SSH CAs'))
      .setListFunction(listCAs)
      .setProperty('auth_id', {
        label: gettext('Project/CA ID')
      })
      .setProperty('host_key.pub', {
        label: gettext('Host Public Key')
      })
      .setProperty('user_key.pub', {
        label: gettext('User Public Key')
      });

    resourceType
      .tableColumns
      .append({
        id: 'auth_id',
        priority: 1
      })
      .append({
        id: 'host_key.pub',
        priority: 2
      })
      .append({
        id: 'user_key.pub',
        priority: 2
      });


    function listCAs() {
      return caApi.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        //response.data.items = response.data.CAs;

        util.addTimestampIds(response.data.items, 'auth_id');

        return response;
      });
    }
  }

})();

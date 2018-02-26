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
    .module('tatudashboard.resources.os-tatu-user', [
      'ngRoute',
      'tatudashboard.resources.os-tatu-user.actions',
      'tatudashboard.resources.os-tatu-user.details'
    ])
    .constant(
      'tatudashboard.resources.os-tatu-user.resourceType', 'OS::Tatu::User')
    .config(config)
    .run(run);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/resources/os-tatu-user/';
    $provide.constant('tatudashboard.resources.os-tatu-user.basePath', path);
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-user.api',
    'tatudashboard.resources.os-tatu-user.resourceType',
    'tatudashboard.resources.util',
    '$filter'
  ];

  function run(registry,
               userApi,
               resourceTypeString,
               util,
               $filter) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH User'), gettext('SSH Users'))
      .setListFunction(listUsers)
      .setProperty('action', {
        label: gettext('Action'),
        filters: ['lowercase', 'noName'],
        values: util.actionMap()
      })
      .setProperty('user_id', {
        label: gettext('User ID')
      })
      .setProperty('user_name', {
        label: gettext('User Name')
      })
      .setProperty('created_at', {
        label: gettext('Created')
      })
      .setProperty('expires_at', {
        label: gettext('Expires')
      })
      .setProperty('fingerprint', {
        label: gettext('Fingerprint')
      })
      .setProperty('auth_id', {
        label: gettext('Project/CA ID')
      })
      .setProperty('revoked', {
        label: gettext('Was Revoked')
      })
      .setProperty('serial', {
        label: gettext('Serial Number')
      })
      .setProperty('cert', {
        label: gettext('User Certificate')
      });

    resourceType
      .tableColumns
      .append({
        id: 'serial',
        priority: 1
      })
      .append({
        id: 'user_name',
        priority: 2
      })
      .append({
        id: 'principals',
        priority: 2
      })
      .append({
        id: 'revoked',
        priority: 2
      })
      .append({
        id: 'expires_at',
        priority: 2
      });
      /*.append({
        id: 'cert',
        priority: 2,
        filters: [function(input){ return $filter('limitTo')(input, 50, 0); }]
      });*/


    function listUsers() {
      return userApi.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.certs;

        util.addTimestampIds(response.data.items, 'user_id');

        return response;
      });
    }
  }

})();

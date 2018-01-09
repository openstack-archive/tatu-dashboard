/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  angular
    .module('tatudashboard.resources.os-tatu-host')
    .factory('tatudashboard.resources.os-tatu-host.api', apiService);

  apiService.$inject = [
    'tatudashboard.apiPassthroughUrl',
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngdoc service
   * @param {Object} httpService
   * @param {Object} toastService
   * @name apiService
   * @description Provides direct access to Tatu Host APIs.
   * @returns {Object} The service
   */
  function apiService(apiPassthroughUrl, httpService, toastService) {
    var service = {
      get: get,
      list: list,
      deleteHost: deleteHost,
      create: create,
      update: update
    };

    return service;

    ///////////////

    /**
     * @name list
     * @description
     * Get a list of hosts.
     *
     * The listing result is an object with property "items." Each item is
     * a host.
     *
     * @param {Object} params
     * Query parameters. Optional.
     *
     * @returns {Object} The result of the API call
     */
    function list(params) {
      var config = params ? {'params': params} : {};
      var hosts = [{
        'instance_id': '00000000-aaaa-bbbb-cccc-111122224444',
        'hostname': 'fluffy',
        'proj_id': 'aaaaaaaa-aaaa-bbbb-cccc-111122224444',
        'proj_name': 'ProjectA',
        'cert': 'Bogus ssh cert...',
        'pat': '11.11.0.1:1002,11.11.0.2:1002',
        'srv_url': '_ssh._tcp.fluffy.aaaaaaaa.tatu.com.',
        },{
        'instance_id': '11111111-aaaa-bbbb-cccc-111122224444',
        'hostname': 'chester',
        'proj_id': 'aaaaaaaa-aaaa-bbbb-cccc-111122224444',
        'proj_name': 'ProjectA',
        'cert': 'Bogus ssh cert...',
        'pat': '11.11.0.1:1005,11.11.0.2:1005',
        'srv_url': '_ssh._tcp.chester.aaaaaaaa.tatu.com.',
        },{
        'instance_id': '22222222-aaaa-bbbb-cccc-111122224444',
        'hostname': 'snoopy',
        'proj_id': 'aaaaaaaa-aaaa-bbbb-cccc-111122224444',
        'proj_name': 'ProjectA',
        'cert': 'Bogus ssh cert...',
        'pat': '11.11.0.1:1009,11.11.0.2:1009',
        'srv_url': '_ssh._tcp.snoopy.aaaaaaaa.tatu.com.',
        }];
      return hosts;
      /*
      return httpService.get(apiPassthroughUrl + 'hosts/', config)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the host.'));
        });*/
    }

    /**
     * @name get
     * @description
     * Get a single host by ID.
     *
     * @param {string} id
     * Specifies the id of the host to request.
     *
     * @returns {Object} The result of the API call
     */
    function get(id) {
      return httpService.get(apiPassthroughUrl + 'hosts/' + id + '/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the host.'));
        });
    }

    /**
     * @name deleteHost
     * @description
     * Delete a single host by ID
     * @param id
     * @returns {*}
     */
    function deleteHost(id) {
      return httpService.delete(apiPassthroughUrl + 'hosts/' + id + '/')
        .error(function () {
          toastService.add('error', gettext('Unable to delete the host.'));
        });
    }

    /**
     * @name create
     * @description
     * Create a host
     *
     * @param {Object} data
     * Specifies the host information to create
     *
     * @returns {Object} The created host object
     */
    function create(data) {
      return httpService.post(apiPassthroughUrl + 'hosts/', data)
        .error(function() {
          toastService.add('error', gettext('Unable to create the host.'));
        })
    }

    /**
     * @name create
     * @description
     * Update a host
     *
     * @param {Object} id - host id
     * @param {Object} data to pass directly to host update API
     * Specifies the host information to update
     *
     * @returns {Object} The updated host object
     */
    function update(id, data) {
      // The update API will not accept extra data. Restrict the input to only the allowed
      // fields
      var apiData = {
        email: data.email,
        ttl: data.ttl,
        description: data.description
      };
      return httpService.patch(apiPassthroughUrl + 'hosts/' + id + '/', apiData )
        .error(function() {
          toastService.add('error', gettext('Unable to update the host.'));
        })
    }
  }
}());

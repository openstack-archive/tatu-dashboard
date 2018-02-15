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
    .module('tatudashboard.resources.os-tatu-user')
    .factory('tatudashboard.resources.os-tatu-user.api', apiService);

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
   * @description Provides direct access to Tatu user APIs.
   * @returns {Object} The service
   */
  function apiService(apiPassthroughUrl, httpService, toastService) {
    var service = {
      create: create,
      revoke: revoke,
      get: get,
      list: list
    };

    return service;

    ///////////////
    
    /**
     * @name create
     * @description
     * Create a User Certificate
     *
     * @param {Object} data
     * Specifies the User Certificate information to create
     *
     * @returns {Object} The created user object
     */
    function create(data) {
      return httpService.post(apiPassthroughUrl + 'usergen/usercerts/', data)
        .error(function() {
          toastService.add('error', gettext('Unable to create the certificate.'));
        })
    }

    /**
     * @name revoke
     * @description
     * Revoke a single certificate
     *
     * @param {Object} user
     * Specifies the user certificate to revoke
     *
     * @returns {Object} The revoked user certificate
     */
    function revoke(user) {
      var data = { 'serial': user.serial }
      var url = apiPassthroughUrl + 'revokeduserkeys/' + user.auth_id + '/'
      return httpService.post(url, data)
        .error(function() {
          toastService.add('error', gettext('Unable to revoke the certificate.'));
        })
    }

    /**
     * @name list
     * @description
     * Get a list of users.
     *
     * The listing result is an object with property "items." Each item is
     * a user.
     *
     * @param {Object} params
     * Query parameters. Optional.
     * 
     * @returns {Object} The result of the API call
     */
    function list(params) {
      var config = params ? {'params': params} : {};
      return httpService.get(apiPassthroughUrl + 'usercerts/', config)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the users.'));
        });
    }

    /**
     * @name get
     * @description
     * Get a single user by ID.
     *
     * @param {string} id
     * Specifies the id of the user to request.
     *
     * @returns {Object} The result of the API call
     */
    function get(id) {
      return httpService.get(apiPassthroughUrl + 'usercerts/' + id + '/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the user.'));
        });
    }

  }
}());

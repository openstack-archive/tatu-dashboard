/**
 *
 * (c) Copyright 2016 Hewlett Packard Enterprise Development Company LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
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

  angular
    .module('tatudashboard.resources.os-tatu-host.actions')
    .factory('tatudashboard.resources.os-tatu-host.actions.common-forms', service);

  service.$inject = [
  ];

  /**
   * Service to return a schema form config for action forms. Especially useful for forms
   * like create and update that differ only in the readonly state of certain form fields.
   *
   * @returns {object} A schema form config
   */
  function service() {
    var service = {
      getCreateFormConfig: getCreateFormConfig,
      getUpdateFormConfig: getUpdateFormConfig
    };

    return service;

    /////////////////

    /**
     * Returns the create host form config
     * @returns {{schema, form, model}|*}
     */
    function getCreateFormConfig() {
      return getCreateUpdateFormConfig(false);
    }

    /**
     * Return the update host form config
     * @returns {{schema, form, model}|*}
     */
    function getUpdateFormConfig() {
      return getCreateUpdateFormConfig(true);
    }

    /**
     * Return the create/update host form.  The two forms are identical except for
     * during update, some fields are read-only.
     *
     * @param readonly - sets readonly value on form fields that change between update and create
     * @returns {object} a schema form config, including default model
     */
    function getCreateUpdateFormConfig(readonly) {
      return {
        "schema": {
          "type": "object",
          "properties": {
            "hostname": {
              "type": "string",
            },
            "instance_id": {
              "type": "string",
            },
            "proj_id": {
              "type": "string",
            },
            "proj_name": {
              "type": "string",
            },
            "cert": {
              "type": "string",
            },
            "pat": {
              "type": "string",
            },
            "srv_url": {
              "type": "string",
            }
          }
        },
        "form": [
          {
            "key": "hostname",
            "readonly": readonly,
            "title": gettext("Hostname"),
            "description": gettext("Foobar fudd"),
            "type": "text",
            "required": true
          },
          {
            "key": "proj_name",
            "readonly": readonly,
            "title": gettext("Project Name"),
            "description": gettext("Confounded JS noobie."),
            "type": "text",
            "required": true
          }
        ],
        "model": {
          "proj_name": "Project24",
          "hostname": "pluto"
        }
      };
    }
  }
})();

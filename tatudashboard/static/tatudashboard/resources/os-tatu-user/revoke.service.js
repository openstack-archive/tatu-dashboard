/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
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

(function() {
  'use strict';

  angular
    .module('tatudashboard.resources.os-tatu-user.actions')
    .factory('tatudashboard.resources.os-tatu-user.actions.revoke', action);

  action.$inject = [
    '$q',
    'tatudashboard.resources.os-tatu-user.api',
    'tatudashboard.resources.util',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.simple-modal.service',
    'horizon.framework.widgets.toast.service',
    'tatudashboard.resources.os-tatu-user.resourceType'
  ];

  /*
   * @ngdoc factory
   * @name tatudashboard.resources.os-tatu-user.actions.revoke
   *
   * @Description
   * Brings up the revoke user confirmation modal dialog.

   * On submit, revoke given user SSH certificate.
   * On cancel, do nothing.
   */
  function action(
    $q,
    userApi,
    util,
    policy,
    actionResultService,
    gettext,
    $qExtensions,
    simpleModalService,
    toast,
    resourceType
  ) {
    var scope, context, revokeUserPromise;
    var notAllowedMessage = gettext("You are not allowed to revoke user certificates: %s");

    var service = {
      initAction: initAction,
      allowed: allowed,
      perform: perform
    };

    return service;

    //////////////

    function initAction() {
      context = { };
      revokeUserPromise = policy.ifAllowed({rules: [['ssh', 'revoke_user_cert']]});
    }

    function perform(items, thescope) {
      scope = thescope
      var users = angular.isArray(items) ? items : [items];
      context.labels = labelize(users.length);
      return $qExtensions.allSettled(users.map(checkPermission)).then(afterCheck);
    }

    function allowed(user, thescope) {
      // only row actions pass in user
      // otherwise, assume it is a batch action
      if (user) {
        return $q.all([
          revokeUserPromise
        ]);
      } else {
        return policy.ifAllowed({ rules: [['ssh', 'revoke_user_cert']] });
      }
    }

    function checkPermission(user) {
      return {promise: allowed(user), context: user};
    }

    function afterCheck(result) {
      var outcome = $q.reject();  // Reject the promise by default
      if (result.fail.length > 0) {
        toast.add('error', getMessage(notAllowedMessage, result.fail.map(getUser)));
        outcome = $q.reject(result.fail);
      }
      if (result.pass.length > 0) {
        outcome = open(result.pass.map(getUser)).then(createResult);
      }
      return outcome;
    }

    function createResult(deleteModalResult) {
      // To make the result of this action generically useful, reformat the return
      // from the deleteModal into a standard form
      var actionResult = actionResultService.getActionResult();
      deleteModalResult.pass.forEach(function markDeleted(item) {
        actionResult.updated(resourceType, getUser(item).serial);
      });
      deleteModalResult.fail.forEach(function markFailed(item) {
        actionResult.failed(resourceType, getUser(item).serial);
      });
      return actionResult.result;
    }

    function labelize(count) {
      return {

        title: ngettext(
          'Confirm Revoke User Certificate',
          'Confirm Revoke Users Certificates', count),

        message: ngettext(
          'You have selected "%s". Revoked user cert is not recoverable.',
          'You have selected "%s". Revoked users certs are not recoverable.', count),

        submit: ngettext(
          'Revoke User Certificate',
          'Revoke Users Certificates', count),

        success: ngettext(
          'Revoked User Cert: %s.',
          'Revoked Users Certs: %s.', count),

        error: ngettext(
          'Unable to revoke User Certificate: %s.',
          'Unable to revoke Users Certificates: %s.', count)
      };
    }

    function open(users) {
      var options = {
        title: context.labels.title,
        body: interpolate(context.labels.message, [users.map(getSerial).join("\", \"")]),
        submit: context.labels.submit
      };

      return simpleModalService.modal(options).result.then(onModalSubmit);

      function onModalSubmit() {
        return $qExtensions.allSettled(users.map(revokePromise)).then(notify);
      }

      function revokePromise(user) {
        return {promise: userApi.revoke(user), context: user};
      }

      function notify(result) {
        if (result.pass.length > 0) {
          var passEntities = result.pass.map(getUser);
          scope.$emit(context.successEvent, passEntities.map(getSerial));
          toast.add('success', getMessage(context.labels.success, passEntities));
        }

        if (result.fail.length > 0) {
          var failEntities = result.fail.map(getUser);
          scope.$emit(context.failedEvent, failEntities.map(getSerial));
          toast.add('error', getMessage(context.labels.error, failEntities));
        }
        // Return the passed and failed entities as part of resolving the promise
        return result;
      }
    }

    function getUser(result) {
      return result.context;
    }

    /**
     * Helper method to get the displayed message
     */
    function getMessage(message, users) {
      return interpolate(message, [users.map(getSerial).join(", ")]);
    }

    /**
     * Helper method to get the serial number of the user
     */
    function getSerial(user) {
      return user.serial;
    }

  }
})();

'use strict';

var Notifications = function () {
};

Notifications.options = {
  dismissAfter: 8000
};

Notifications.prototype = {
  constructor: Notifications
};

/**
 * Creates a new notification
 *
 * @param {string} type                  the notification type: one of
 *                                        - info
 *                                        - success
 *                                        - warning
 *                                        - error
 *                                        - confirmation
 * @param {string} message               the notification message to display
 * @param {Array} [actions]              an optional options object containing interaction options
 *                                       for the notification. This can be between 0 and 2 actions
 *                                       in the following format:
 *                                       { name: 'Button label', action: function(){} }
 *
 * // TODO: Implement options
 * @param {object} [options]             an optional options object, where the following options are
 *                                       available:
 * @param {bool} options.actionRequired  indicates the notification shall not disappear until the
 *                                       user has clicked on an action button. (requires actions)
 * @param {number} options.dismissTime   number of miliseconds until the notifications is removed
 *                                       automatically. Can not be used in conjunction with
 *                                       actionRequired.
 * @param {function} options.onClick     Callback to execute on clicking anywhere on the
 *                                       notification. Cannot be used with actions (eg. only for
 *                                       message notifications like "reload the page").
 * @param {string} options.position      provides a position for the notification, where position
 *                                       can be one of
 *                                        - top-left
 *                                        - top-right
 *                                        - top-center
 *                                        - bottom-left
 *                                        - bottom-right
 *                                        - bottom-center
 */
Notifications.prototype.create = function (type, message, actions, options) {
  var availableNotificationTypes = [
        'info',
        'success',
        'warning',
        'error',
        'confirmation'
      ],
      actionContext = this,
      dismissAfter = Notifications.options.dismissAfter;

  // check whether the notification type is known
  if (availableNotificationTypes.indexOf(type) === - 1) {
    return console.error(new Error('The notification type ' + type + ' is not available.'));
  }

  // set empty options Array
  actions = actions || [];

  // limit the options to two choices
  if (actions.length > 2) {
    console.error('Only two options per notification are possible');
    actions = actions.slice(0, 2);
  }


  var domNode = $(document.createElement('div'));
  domNode.addClass('notification ' + type);
  domNode.append('<span class="message">' + message + '</span>');

  if (actions.length > 0) {
    for (var i = 0; i < actions.length; i ++) {
      var data = actions[ i ],
          actionId = this.createId(8);

      domNode.append('<button class="action" data-action-id="' + actionId + '">' + data.name + '</button>');

      $(document).on('click', '[data-action-id="' + actionId + '"]', function (data) {
        data.action.call(this);
      }.bind(actionContext, data));
    }
  }


  if ($('.notification').length) {
    $('.notification').each(function (index, current) {
      $(current).css({
        bottom: ((index + 1) * 80 + 30) + 'px'
      })
    });
  }

  /**
   * append notification to document
   */
  $('body').append(domNode);
  domNode.hide().fadeIn();

  if (type !== 'confirmation') {
    domNode.data('dismissTimer', setTimeout(function() {
      domNode.fadeOut(200);

      setTimeout(function() {
        domNode.remove();
        $(document).trigger('notifications:removed');
      }, 200);
    }, dismissAfter));
  }


  /**
   * setup notification removal after action callback execution
   */
  $(document).on('click', '.notification button.action', function (event) {
    var notificationElement = $(this).parent();
    notificationElement.fadeOut(200);

    setTimeout(function () {
      notificationElement.remove();
      $(document).trigger('notifications:removed');
    }, 200);
  });


  /**
   * stop automatic removal if the mouse hovers over the notification
   */
  $(document).on('mouseenter', '.notification', function (event) {
    if (type !== 'confirmation') {
      clearTimeout($(this).data('dismissTimer'));
    }
  });


  /**
   * restart automatic removal if the mouse leaves the notification
   */
  $(document).on('mouseleave', '.notification', function (event) {
    if (type !== 'confirmation') {
      var domNode = $(this),
          dismissTimeout = function () {
            return setTimeout(function () {
              domNode.fadeOut(200);
              setTimeout(function () {
                domNode.remove();
                $(document).trigger('notifications:removed');
              }, 200);
            }, Notifications.options.dismissAfter)
          };
      $(this).data('dismissTimer', dismissTimeout(), Notifications.options.dismissAfter);
    }
  });
};


/**
 * wrapper for info notifications
 *
 * @param message
 * @param options
 */
Notifications.prototype.info = function (message, options) {
  this.create('info', message, options);
};


/**
 * wrapper for success notifications
 *
 * @param message
 * @param options
 */
Notifications.prototype.success = function (message, options) {
  this.create('success', message, options);
};


/**
 * wrapper for warning notifications
 *
 * @param message
 * @param options
 */
Notifications.prototype.warning = function (message, options) {
  this.create('warning', message, options);
};


/**
 * wrapper for error notifications
 *
 * @param message
 * @param options
 */
Notifications.prototype.error = function (message, options) {
  this.create('error', message, options);
};


/**
 * wrapper for confirmation notifications
 *
 * @param message
 * @param options
 */
Notifications.prototype.confirmation = function (message, options) {
  this.create('confirmation', message, options);
};


Notifications.prototype.createId = function (count) {
  var result = '';
  var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (var i = 0; i < count; i ++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return result;
};

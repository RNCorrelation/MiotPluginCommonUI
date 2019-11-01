var LHEvents = (function () {
  var _ = {}
  _.keys = function (obj) {
    if (!_.isObject(obj)) return []
    if (Object.keys) return Object.keys(obj)
    var keys = []
    for (var key in obj) {
      if (_.has(obj, key)) keys.push(key)
    }
    return keys
  }

  _.isObject = function (obj) {
    var type = typeof obj
    return type === 'function' || (type === 'object' && !!obj)
  }
  _.has = function (obj, key) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key)
  }

  // Events
  // ---------------

  var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function (name, callback, context) {
      if (!name || !callback) return this
      this._events || (this._events = {})
      var events = this._events[name] || (this._events[name] = [])
      events.push({ callback: callback, context: context, ctx: context || this })
      return this
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function (name, callback, context) {
      if (!name || !callback) return this
      var self = this
      var once = function () {
        self.off(name, once)
        callback.apply(self, arguments)
      }
      return this.on(name, once, context)
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function (name, callback, context) {
      if (!this._events) return this
      // Remove all callbacks for all events.
      if (!name && !callback && !context) {
        this._events = void 0
        return this
      }

      var names = name ? [name] : _.keys(this._events)
      for (var i = 0, length = names.length; i < length; i++) {
        name = names[i]

        // Bail out if there are no events stored.
        var events = this._events[name]
        if (!events) continue

        // Remove all callbacks for this event.
        if (!callback && !context) {
          delete this._events[name]
          continue
        }

        // Find any remaining events.
        var remaining = []
        for (var j = 0, k = events.length; j < k; j++) {
          var event = events[j]
          if ((callback && callback !== event.callback) || (context && context !== event.context)) {
            remaining.push(event)
          }
        }

        // Replace events if there are any remaining.  Otherwise, clean up.
        if (remaining.length) {
          this._events[name] = remaining
        } else {
          delete this._events[name]
        }
      }

      return this
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function (name) {
      if (!this._events) return this
      var args = Array.prototype.slice.call(arguments, 1)
      if (!name) return this
      var events = this._events[name]
      var allEvents = this._events.all
      if (events) triggerEvents(events, args)
      if (allEvents) triggerEvents(allEvents, arguments)
      return this
    }

  }
  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  //  events have 3 arguments).
  var triggerEvents = function (events, args) {
    var ev
    var i = -1
    var l = events.length
    var a1 = args[0]
    var a2 = args[1]
    var a3 = args[2]
    switch (args.length) {
      case 0:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx)
        return
      case 1:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1)
        return
      case 2:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2)
        return
      case 3:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3)
        return
      default:
        while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args)
        // eslint-disable-next-line
        return
    }
  }
  return Events
})()

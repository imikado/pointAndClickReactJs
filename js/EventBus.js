var EventBus = {
    tEvent: {},

    subscribe: function(sEvent, callbackFunction) {
        if (!this.tEvent[sEvent]) {
            this.tEvent[sEvent] = [];
        }

        this.tEvent[sEvent].push(callbackFunction);
    },

    publish: function(sEvent, params) {
        // return if the topic doesn't exist, or there are no listeners
        if (!this.tEvent[sEvent] || this.tEvent[sEvent].length < 1) return;

        // send the event to all listeners
        this.tEvent[sEvent].forEach(function(callbackFunctionToCall) {
            callbackFunctionToCall(params || {});
        });
    }
};
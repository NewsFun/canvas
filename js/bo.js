/**
 * Created by bobo on 2016/12/15.
 */
//constructor
var Promise = function() {
    this.callbacks = [];
};

Promise.prototype = {
    construct: Promise,
    resolve: function(result) {
        this.complete("resolve", result);
    },

    reject: function(result) {
        this.complete("reject", result);
    },

    complete: function(type, result) {
        while (this.callbacks[0]) {
            this.callbacks.shift()[type](result);
        }
    },

    then: function(successHandler, failedHandler) {
        this.callbacks.push({
            resolve: successHandler,
            reject: failedHandler
        });

        return this;
    }
};
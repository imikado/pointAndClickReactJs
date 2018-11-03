var Debug = {
    enabled: false,
    log: function(uContent_) {
        if (this.enabled === true) {
            console.log(uContent_);
        }
    },
    error: function(uContent_) {
        if (this.enabled === true) {
            console.error(uContent_);
        }
    },
    warning: function(uContent_) {
        if (this.enabled === true) {
            console.warn(uContent_);
        }
    }
};
Debug.enabled = false;
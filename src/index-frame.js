(function () {
    'use strict';
    const safeCall = (func) => {
        try {
            return func();
        }
        catch {
            return null;
        }
    };
    const set = (name, value, options = {}) => {
        const encodedName = safeCall(() => encodeURIComponent(name));
        const encodedValue = safeCall(() => encodeURIComponent(value));
        if (encodedName === null || encodedValue === null) {
            return;
        }
        options = { path: "/", ...options };
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        let updatedCookie = encodedName + "=" + encodedValue;
        for (const optionKey in options) {
            updatedCookie += "; " + optionKey;
            const optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        return document.cookie = updatedCookie;
    };

    const setForAllSubdomains = (name, value, options = {}) => {
        let domain = window.location.hostname.replace(/(((http|https):)?\/\/)?/i, "");
        while (domain.includes(".")) {
            safeCall(() => set(name, value, { ...options, domain: "." + domain }));
            domain = domain.split(".").slice(1).join(".");
        }
    };
    const getExpirationDate = (days) => {
        const date = new Date();
        date.setHours(date.getHours() + days * 24);
        return date;
    };
    var DEFAULT_TIME_TO_LIVE = 3650;
    var STORAGE_KEY = "cid";
    var id = document.location.search.substring(1);
    if (id) {
        var expires = getExpirationDate(DEFAULT_TIME_TO_LIVE);
        var options = {
            expires: expires
        };
        setForAllSubdomains(STORAGE_KEY, id, options);
    }

})();

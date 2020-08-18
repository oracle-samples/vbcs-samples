/**
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['vb/helpers/rest'], function(Rest) {
    'use strict';

    var PageModule = function PageModule() {};
    PageModule.prototype.uniqueEmailValidator = function() {
        return {
            hint: Promise.resolve('Provide a unique email to the Employee'),
            validate: value => {
                return new Promise((resolve, reject) => {
                    Rest.get('businessObjects/getall_Employee').parameters({
                            q: `email = '${value}'`
                        }).fetch()
                        .then(res => {
                            if (res.body.items.length > 0) {
                                reject({
                                    detail: 'Duplicate entry found for Employee ' +
                                        res.body.items[0].firstName
                                })
                            } else {
                                resolve()
                            }
                        })
                })
            }
        }
    }

    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    PageModule.prototype.isFormValid = function(arg1) {
        var el = document.getElementById('tracker');
        if (el.valid === 'valid') {
            return true;
        } else {
            el.showMessages();
            el.focusOn('@firstInvalidShown');
            return false;
        }
    };
    return PageModule;
});

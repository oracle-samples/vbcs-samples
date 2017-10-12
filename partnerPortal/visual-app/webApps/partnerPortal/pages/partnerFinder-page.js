'use strict';

define(['components/googlemap/loader'], function() {
    const PageModule = function PageModule() {};

    PageModule.prototype.sort = function (configuration, options) {
        const c = configuration;

        if (options && options.key) {
            const dir = options.direction === 'descending' ? 'desc' : 'asc';
            let newUrl = c.url;
            newUrl = `${newUrl}&orderBy=${options.name}:${dir}`;
            c.url = newUrl;
        }
        return c;
        // };
    };

    // Filter transform function
    PageModule.prototype.filter = function (configuration, options) {
        const c = configuration;
        if (options && Array.isArray(options) && options.length > 0) {
            let qParam = '';
            options.forEach(function (item) {
                if (item.value === '' || item.value === undefined) {
                    return;
                }
                let op = '';
                if (item.name === 'FormattedAddress') {
                    // FormattedAddress cannot be used reliably in my experience
                    // for address search; eg. it does not contain Country, city
                    // is always in uppercase, and Ive seen search produce wrong results;
                    // my guess is that FormattedAddress is fomula and not really searchable
                    op = `((AddressLineOne LIKE '*${item.value}*') OR (Country LIKE '*${item.value}*') OR (City LIKE '*${item.value}*') OR (PostalCode LIKE '*${item.value}*') OR (State LIKE '*${item.value}*'))`;
                } else {
                    // all other fields are handled regular way:
                    if (item.op === 'eq') {
                        op = `(${item.name} = '${item.value}')`;
                    } else if (item.op === 'co') {
                        op = `(${item.name} LIKE '*${item.value}*')`;
                    } else {
                        return;
                    }
                }
                if (qParam.length !== 0) {
                    qParam += ' AND ';
                }
                qParam += op;
            });
            if (qParam.length !== 0) {
                // FIXME: check whether URL already contains "&" so that it is not added twice
                c.url = `${c.url}&q=${qParam}`;
            }
        }
        return c;
    };

    return PageModule;
});

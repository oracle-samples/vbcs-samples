/* jshint devel:true */
'use strict';

define([], () => {
    const PageModule = function PageModule() {};
    
    PageModule.prototype.printPartner = function(partner) {
          console.log(partner);
    }

    return PageModule;
});

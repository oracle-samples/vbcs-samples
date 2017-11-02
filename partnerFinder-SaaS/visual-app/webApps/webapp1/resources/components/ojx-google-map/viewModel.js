define(
    ['ojs/ojcore', 'knockout', 'jquery'], function (oj, ko, $) {
    'use strict';
    function GoogleMapComponentModel(context) {
        var self = this;
        self.element = context.element;
        self.elementWidth = ko.observable();
        self.elementHeight = ko.observable();
    }
    ;

    GoogleMapComponentModel.prototype.attached = function (context) {
        var self = this;
        //Work out the correct size of the iframe and the CCA element based on either
        //The explicit size of the CCA or the dimensions of the parent if explicit sizes are
        //not defined
        var calcHeightElement = context.element;
        var calcWidthElement = context.element;
        
        var heightExplicit = context.element.style.getPropertyValue('height');
        var widthExplicit = context.element.style.getPropertyValue('width');
        if (heightExplicit === ''){
            calcHeightElement = context.element.parentElement;
        }
        
        if (widthExplicit === ''){
            calcWidthElement = context.element.parentElement;
        }  
        
        var calcHeight = calcHeightElement.clientHeight;
        var calcWidth = calcWidthElement.clientWidth;

        self.elementWidth(parseInt(calcWidth));
        self.elementHeight(parseInt(calcHeight));
        context.element.style.width = self.elementWidth() + 'px';
        context.element.style.height = self.elementHeight() + 'px';
    };

    return GoogleMapComponentModel;
});



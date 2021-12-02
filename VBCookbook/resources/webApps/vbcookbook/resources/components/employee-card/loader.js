define([
    './employee-card-viewModel',
    'ojs/ojcomposite',
    'text!./employee-card-view.html',
    'text!./component.json',
    'css!./employee-card-styles'
], function (
    viewModel,
    Composite,
    view,
    metadata) {
        'use strict';

        Composite.register('employee-card', {
            view: view,
            viewModel: viewModel,
            metadata: JSON.parse(metadata)
        });
    }
);
define(
    ['ojs/ojcore', './viewModel', 'text!./view.html','text!./component.json', 'css!./style.css', 'ojs/ojcomposite'],
    function (oj, ComponentModel, view, metadata, css) {
        'use strict';
        oj.Composite.register('ojx-google-map',
            {
                metadata: {inline: JSON.parse(metadata)},
                viewModel: {inline: ComponentModel},
                view: {inline: view},
                css: {inline: css}
            });
    }
);
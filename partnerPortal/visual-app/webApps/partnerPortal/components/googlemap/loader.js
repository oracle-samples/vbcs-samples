define(['ojs/ojcore', './viewModel', 'text!./view.html','text!./component.json', 'ojs/ojcomposite'],
  function (oj, viewModel, view, metadata) {
    oj.Composite.register('google-map', {
      metadata: {inline: JSON.parse(metadata)},
      viewModel: {inline: viewModel},
      view: {inline: view}
    });
  }
);
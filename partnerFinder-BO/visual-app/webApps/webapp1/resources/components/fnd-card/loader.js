define(['ojs/ojcore', 'text!./fnd-card.html', './fnd-card', 
	'text!./component.json', 'css!./fnd-card.css', 'ojs/ojcomposite'],
 function (oj, view, viewModel, metadata, css) {
	oj.Composite.register('fnd-card', {
		view: { inline: view },
		viewModel: { inline: viewModel },
		metadata: { inline: JSON.parse(metadata) },
		css: { inline: css }
	});
}
);

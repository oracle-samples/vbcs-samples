define(
	['ojs/ojcore', 'text!./fnd-card.html', './fnd-card',
		'text!./component.json', 'css!./fnd-card.css', 'ojs/ojcomposite'],
	function (oj: any, view: any, viewModel: any, metadata: any, css: any): void {
		oj.Composite.register('fnd-card', {
			css: { inline: css },
			metadata: { inline: JSON.parse(metadata) },
			view: { inline: view },
			viewModel: { inline: viewModel },
		});
	}
);





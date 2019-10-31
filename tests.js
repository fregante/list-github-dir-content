// Manual tests, sorry!

const listContent = require('.');

listContent
	.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/libs'
	})
	.then(data => console.log('\nviaTreesApi\n', data));

listContent
	.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/libs',
		getFullData: true
	})
	.then(data => console.log('\nviaTreesApi (detailed)\n', data));

listContent
	.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/libs'
	})
	.then(data => console.log('\nviaContentsApi\n', data));

listContent
	.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/libs',
		getFullData: true
	})
	.then(data => console.log('\nviaContentsApi (detailed)\n', data));

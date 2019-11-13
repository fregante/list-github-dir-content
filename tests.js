// Manual tests, sorry!

const listContent = require('.');

listContent
	.viaTreesApi({
		resource: {
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/libs'
		}
	})
	.then(data => console.log('\nviaTreesApi:object\n', data));

listContent
	.viaTreesApi({
		resource: 'https://github.com/sindresorhus/refined-github/tree/master/source/libs'
	})
	.then(data => console.log('\nviaTreesApi:url\n', data));

listContent
	.viaTreesApi({
		resource: {
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/libs'
		},
		getFullData: true
	})
	.then(data => console.log('\nviaTreesApi:object (detailed)\n', data));

listContent
	.viaTreesApi({
		resource: 'https://github.com/sindresorhus/refined-github/tree/master/source/libs',
		getFullData: true
	})
	.then(data => console.log('\nviaTreesApi:url (detailed)\n', data));

listContent
	.viaContentsApi({
		resource: {
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/libs'
		}
	})
	.then(data => console.log('\nviaContentsApi:object\n', data));

listContent
	.viaContentsApi({
		resource: 'https://github.com/sindresorhus/refined-github/tree/master/source/libs'
	})
	.then(data => console.log('\nviaContentsApi:url\n', data));

listContent
	.viaContentsApi({
		resource: {
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/libs'
		},
		getFullData: true
	})
	.then(data => console.log('\nviaContentsApi:object (detailed)\n', data));

listContent
	.viaContentsApi({
		resource: 'https://github.com/sindresorhus/refined-github/tree/master/source/libs',
		getFullData: true
	})
	.then(data => console.log('\nviaContentsApi:url (detailed)\n', data));

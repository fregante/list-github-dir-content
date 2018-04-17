// Manual tests, sorry!

const listContent = require('.');

listContent
	.viaTreesApi('sindresorhus/refined-github', 'source/libs')
	.then(data => console.log('\nviaTreesApi\n', data));

listContent
	.viaContentsApi('sindresorhus/refined-github', 'source/libs')
	.then(data => console.log('\nviaContentsApi\n', data));

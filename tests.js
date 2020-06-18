// Manual tests, sorry!

const listContent = require('.');

async function init() {
	let data;

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers'
	});
	console.log('\nviaTreesApi\n', data);

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true
	});
	console.log('\nviaTreesApi (detailed)\n', data);

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir'
	});
	console.log('\nviaTreesApi (404)\n', data);

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers'
	});
	console.log('\nviaContentsApi\n', data);

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true
	});
	console.log('\nviaContentsApi (detailed)\n', data);

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir'
	});
	console.log('\nviaContentsApi (404)\n', data);
}

init().catch(console.error);

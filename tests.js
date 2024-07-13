// Manual tests, sorry!

const listContent = require('.');

async function init() {
	let data;

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
	});
	console.log('\nviaTreesApi\n', data);

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true,
	});
	console.log('\nviaTreesApi (detailed)\n', data);

	data = await listContent.viaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir',
	});
	console.log('\nviaTreesApi (404)\n', data);

	try {
		await listContent.viaTreesApi({
			token: 'broken',
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/helpers',
		});
		throw new Error('An error was expected');
	} catch (error) {
		if (error.message === 'Bad credentials') {
			console.log('\nviaTreesApi (bad token) OK\n');
		} else {
			throw error;
		}
	}

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
	});
	console.log('\nviaContentsApi\n', data);

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true,
	});
	console.log('\nviaContentsApi (detailed)\n', data);

	data = await listContent.viaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir',
	});
	console.log('\nviaContentsApi (404)\n', data);

	try {
		await listContent.viaContentsApi({
			token: 'broken',
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/helpers',
		});
		throw new Error('An error was expected');
	} catch (error) {
		if (error.message === 'Bad credentials') {
			console.log('\nviaContentsApi (bad token) OK\n');
		} else {
			throw error;
		}
	}
}

init().catch(console.error);

// Manual tests, sorry!

import {getDirectoryContentViaTreesApi, getDirectoryContentViaContentsApi} from './index.js';

async function init() {
	let data;

	data = await getDirectoryContentViaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
	});
	console.log('\nviaTreesApi\n', data);

	data = await getDirectoryContentViaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true,
	});
	console.log('\nviaTreesApi (detailed)\n', data);

	data = await getDirectoryContentViaTreesApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir',
	});
	console.log('\nviaTreesApi (404)\n', data);

	try {
		await getDirectoryContentViaTreesApi({
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

	data = await getDirectoryContentViaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
	});
	console.log('\nviaContentsApi\n', data);

	data = await getDirectoryContentViaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'source/helpers',
		getFullData: true,
	});
	console.log('\nviaContentsApi (detailed)\n', data);

	data = await getDirectoryContentViaContentsApi({
		user: 'sindresorhus',
		repository: 'refined-github',
		directory: 'missing/dir',
	});
	console.log('\nviaContentsApi (404)\n', data);

	try {
		await getDirectoryContentViaContentsApi({
			token: 'broken',
			user: 'sindresorhus',
			repository: 'refined-github',
			directory: 'source/helpers',
		});
		throw new Error('An error was expected');
	} catch (error) {
		if (error.message === 'Bad credentials') {
			console.log('\ngetDirectoryContentViaContentsApi (bad token) OK\n');
		} else {
			throw error;
		}
	}
}

await init();

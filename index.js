const fetch = require('node-fetch'); // Automatically excluded in browser bundles

function parseResource(resource) {
	if (typeof resource === 'string') {
		const parsedUrl = new URL(resource);
		const [, user, repository, type, ref, directory] = parsedUrl.pathname.split('/');
		if (type !== 'tree') {
			throw new TypeError('Incompatible URL type, only `tree` works: ' + type);
		}

		resource = {user, repository, ref, directory, origin: parsedUrl.origin};
	}

	if (!resource.origin || resource.origin === 'https://github.com') {
		resource.origin = 'https://api.github.com';
	} else {
		const parsedOrigin = new URL(resource.origin);
		resource.origin = `https://${parsedOrigin.host}/api/v3`;
	}

	return Object.assign({
		ref: 'HEAD'
	}, resource);
}


async function queryApi(url, token) {
	const response = await fetch(url, token ? {
			headers: {
				Authorization: `Bearer ${token}`
			}
		} : undefined
	);
	const contents = await response.json();

	if (contents.message && contents.message !== 'Not Found') {
		throw new Error(contents.message);
	}

	return contents;
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
async function viaContentsApi({
	resource,
	token,
	getFullData = false
}) {
	resource = parseResource(resource);

	const url = new URL(`repos/${resource.user}/${resource.repository}/contents/${resource.directory}`, resource.origin);
	url.searchParams.set('ref', resource.ref);
	const contents = await queryApi(url, token);

	if (contents.message === 'Not Found') {
		return [];
	}

	const files = [];
	const requests = [];
	for (const item of contents) {
		if (item.type === 'file') {
			files.push(getFullData ? item : item.path);
		} else if (item.type === 'dir') {
			requests.push(viaContentsApi({
				resource,
				token,
				getFullData
			}));
		}
	}

	return files.concat(...await Promise.all(requests));
}

// Great for downloads with many sub directories
// Pros: one request + maybe doesn't require token
// Cons: huge on huge repos + may be truncated
async function viaTreesApi({
	resource,
	token,
	getFullData = false
}) {
	resource = parseResource(resource);

	const url = new URL(`repos/${resource.user}/${resource.repository}/git/trees/${resource.ref}`, resource.origin);
	url.searchParams.set('recursive', 1);
	const contents = await queryApi(url, token);

	const files = [];
	for (const item of contents.tree) {
		if (item.type === 'blob' && item.path.startsWith(resource.directory + '/')) {
			files.push(getFullData ? item : item.path);
		}
	}

	files.truncated = contents.truncated;
	return files;
}

module.exports.viaContentsApi = viaContentsApi;
module.exports.viaContentApi = viaContentsApi;
module.exports.viaTreesApi = viaTreesApi;
module.exports.viaTreeApi = viaTreesApi;

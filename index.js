const fetch = require('node-fetch'); // Automatically excluded in browser bundles

// Matches '/<user>/<repo>/tree/<ref>/<dir>'
const urlParserRegex = /^\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.*)/;

function parseResource(resource) {
	if (typeof resource === 'string') {
		const parsedUrl = new URL(resource);
		resource = {};
		[, resource.user, resource.repository, resource.ref, resource.directory] =
			urlParserRegex.exec(parsedUrl.pathname) || [];
		if (typeof resource.directory !== 'string') {
			throw new TypeError('Unable to parse GitHub URL');
		}

		if (parsedUrl.hostname !== 'github.com') {
			resource.api = `https://${parsedUrl.host}/api/v3`;
		}
	}

	resource.api = resource.api || 'https://api.github.com';
	resource.ref = resource.ref || 'HEAD';
	// TODO: Validate
	return resource;
}

async function githubApi(api, endpoint, token) {
	const response = await fetch(`${api}/repos/${endpoint}`, {
		headers: token ? {
			Authorization: `Bearer ${token}`
		} : undefined
	});
	return response.json();
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
async function viaContentsApi({
	resource,
	token,
	getFullData = false
}) {
	resource = parseResource(resource);
	const files = [];
	const requests = [];
	const contents = await githubApi(
		resource.api,
		`${resource.user}/${resource.repository}/contents/${resource.directory}?ref=${resource.ref}`,
		token
	);

	if (contents.message === 'Not Found') {
		return [];
	}

	if (contents.message) {
		throw new Error(contents.message);
	}

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

	const files = [];
	const contents = await githubApi(
		resource.api,
		`${resource.user}/${resource.repository}/git/trees/${resource.ref}?recursive=1`,
		token
	);

	if (contents.message) {
		throw new Error(contents.message);
	}

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

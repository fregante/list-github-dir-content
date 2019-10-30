const fetch = require('node-fetch'); // Automatically excluded in browser bundles

async function api(endpoint, token) {
	token = token ? `&access_token=${token}` : '';
	const response = await fetch(`https://api.github.com/repos/${endpoint}${token}`);
	return response.json();
}

function parseIdentifier(identifier) {
	const [repo, ref = 'HEAD'] = identifier.split('#');
	return {repo, ref};
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
async function viaContentsApi(identifier, dir, token) {
	const files = [];
	const requests = [];
	const {repo, ref} = parseIdentifier(identifier);
	const contents = await api(`${repo}/contents/${dir}?ref=${ref}`, token);
	for (const item of contents) {
		if (item.type === 'file') {
			files.push(item.path);
		} else if (item.type === 'dir') {
			requests.push(viaContentsApi(repo, item.path, token));
		}
	}

	return files.concat(...await Promise.all(requests));
}

// Great for downloads with many sub directories
// Pros: one request + maybe doesn't require token
// Cons: huge on huge repos + may be truncated
async function viaTreesApi(identifier, dir, token) {
	if (!dir.endsWith('/')) {
		dir += '/';
	}

	const files = [];
	const {repo, ref} = parseIdentifier(identifier);
	const contents = await api(`${repo}/git/trees/${ref}?recursive=1`, token);
	for (const item of contents.tree) {
		if (item.type === 'blob' && item.path.startsWith(dir)) {
			files.push(item.path);
		}
	}

	files.truncated = contents.truncated;
	return files;
}

module.exports.viaContentsApi = viaContentsApi;
module.exports.viaContentApi = viaContentsApi;
module.exports.viaTreesApi = viaTreesApi;
module.exports.viaTreeApi = viaTreesApi;

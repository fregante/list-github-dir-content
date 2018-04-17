const fetch = require('node-fetch'); // Automatically excluded in browser bundles

function parseIdentifier(identifier) {
	const [repo, ref = 'HEAD'] = identifier.split('#');
	return {repo, ref}
}

function stringifyQuery(params) {
	return '?' + Object.keys(params)
		.filter(param => params[param] !== undefined)
		.map(param => param + '=' + params[param])
		.join('&');
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
async function viaContentsApi(identifier, dir, token) {
	const files = [];
	const requests = [];
	const {repo, ref} = parseIdentifier(identifier);
	const response = await fetch(`https://api.github.com/repos/${repo}/contents/${dir}${stringifyQuery({
		ref,
		access_token: token
	})}`);
	const contents = await response.json();
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
	const files = [];
	const {repo, ref} = parseIdentifier(identifier);
	const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/${ref}${stringifyQuery({
		recursive: 1,
		access_token: token
	})}`);
	const contents = await response.json();
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

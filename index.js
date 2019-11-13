const fetch = require('node-fetch'); // Automatically excluded in browser bundles

// Matches '/<user>/<repo>/tree/<ref>/<dir>'
const urlParserRegex = /^[/]([^/]+)[/]([^/]+)[/]tree[/]([^/]+)[/](.*)/;

function parseGithubURL(url) {
	const res = {};
	const parsedUrl = new URL(url);
	[, res.user, res.repository, res.ref, res.directory] = urlParserRegex.exec(parsedUrl.pathname) || [];
	if (typeof res.directory !== 'string') {
		throw new TypeError('Unable to parse GitHub URL');
	}

	if (parsedUrl.hostname === 'github.com') {
		res.api = 'https://api.github.com';
	} else {
		res.api = `https://${parsedUrl.host}/api/v3`;
	}

	// TODO: Validate
	return res;
}

async function githubApi(api, endpoint, token) {
	const response = await fetch(`${api}/repos/${endpoint}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.json();
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
async function viaContentsApi({
	resource: res,
	token,
	getFullData = false
}) {
	if (typeof res === 'string') {
		res = parseGithubURL(res);
	}

	const files = [];
	const requests = [];
	const contents = await githubApi(res.api, `${res.user}/${res.repository}/contents/${res.directory}?ref=${res.ref}`, token);

	for (const item of contents) {
		if (item.type === 'file') {
			files.push(getFullData ? item : item.path);
		} else if (item.type === 'dir') {
			requests.push(viaContentsApi({
				resource: res,
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
	resource: res,
	token,
	getFullData = false
}) {
	if (typeof res === 'string') {
		res = parseGithubURL(res);
	}

	const files = [];
	const contents = await githubApi(res.api, `${res.user}/${res.repository}/git/trees/${res.ref}?recursive=1`, token);

	if (!res.directory.endsWith('/')) {
		res.directory += '/';
	}

	for (const item of contents.tree) {
		if (item.type === 'blob' && item.path.startsWith(res.directory)) {
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

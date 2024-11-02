async function api(endpoint, token) {
	const response = await fetch(`https://api.github.com/repos/${endpoint}`, {
		headers: token ? {
			Authorization: `Bearer ${token}`,
		} : undefined,
	});
	return response.json();
}

// Great for downloads with few sub directories on big repos
// Cons: many requests if the repo has a lot of nested dirs
export async function getDirectoryContentViaContentsApi({
	user,
	repository,
	ref: reference = 'HEAD',
	directory,
	token,
	getFullData = false,
}) {
	const files = [];
	const requests = [];
	const contents = await api(`${user}/${repository}/contents/${directory}?ref=${reference}`, token);

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
			requests.push(getDirectoryContentViaContentsApi({
				user,
				repository,
				ref: reference,
				directory: item.path,
				token,
				getFullData,
			}));
		}
	}

	return [...files, ...await Promise.all(requests)].flat();
}

// Great for downloads with many sub directories
// Pros: one request + maybe doesn't require token
// Cons: huge on huge repos + may be truncated
export async function getDirectoryContentViaTreesApi({
	user,
	repository,
	ref: reference = 'HEAD',
	directory,
	token,
	getFullData = false,
}) {
	if (!directory.endsWith('/')) {
		directory += '/';
	}

	const files = [];
	const contents = await api(`${user}/${repository}/git/trees/${reference}?recursive=1`, token);
	if (contents.message) {
		throw new Error(contents.message);
	}

	for (const item of contents.tree) {
		if (item.type === 'blob' && item.path.startsWith(directory)) {
			files.push(getFullData ? item : item.path);
		}
	}

	files.truncated = contents.truncated;
	return files;
}

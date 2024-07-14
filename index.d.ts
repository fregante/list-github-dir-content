export type ListGithubDirectoryOptions = {
	user: string;
	repository: string;
	ref?: string;
	directory: string;
	token?: string;
	getFullData?: boolean;
};

export type TreeResult<T> = {
	truncated: boolean;
} & T[];

export type TreeResponseObject = {
	path: string;
	mode: string;
	type: string;
	size: number;
	sha: string;
	url: string;
};

export type ContentsReponseObject = {
	name: string;
	path: string;
	sha: string;
	size: number;
	url: string;
	html_url: string;
	git_url: string;
	download_url: string;
	type: string;
	_links: {
		self: string;
		git: string;
		html: string;
	};
};

export function getDirectoryContentViaContentsApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<ContentsReponseObject[]> :
	Promise<string[]>;

export function getDirectoryContentViaTreesApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<TreeResult<TreeResponseObject>> :
	Promise<TreeResult<string>>;

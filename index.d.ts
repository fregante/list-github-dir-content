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

// Feel free to contribute fields to this type
export type GitObject = {
	[other: string]: unknown;
	path: string;
	url: string;
};

export function getDirectoryContentViaContentsApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<GitObject[]> :
	Promise<string[]>;

export function getDirectoryContentViaTreesApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<TreeResult<GitObject>> :
	Promise<TreeResult<string>>;

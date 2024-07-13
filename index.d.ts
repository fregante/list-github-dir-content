type ListGithubDirectoryOptions = {
	user: string;
	repository: string;
	ref?: string;
	directory: string;
	token?: string;
	getFullData?: boolean;
};

type TreeResult<T> = {
	truncated: boolean;
} & T[];

export function getDirectoryContentViaContentsApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<any[]> :
	Promise<string[]>;

export function getDirectoryContentViaTreesApi<T extends ListGithubDirectoryOptions>(options: T):
T['getFullData'] extends true ?
	Promise<TreeResult<any>> :
	Promise<TreeResult<string>>;

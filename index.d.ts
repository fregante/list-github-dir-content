type ListGithubDirOptions = {
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

export function viaContentsApi<T extends ListGithubDirOptions>(options: T):
T['getFullData'] extends true ?
	Promise<any[]> :
	Promise<string[]>;

export function viaTreesApi<T extends ListGithubDirOptions>(options: T):
T['getFullData'] extends true ?
	Promise<TreeResult<any>> :
	Promise<TreeResult<string>>;

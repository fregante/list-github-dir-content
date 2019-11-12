interface ResourceOptions {
	api: string
	user: string
	repository: string
	ref?: string
	directory: string
}

interface ListGithubDirOptions {
	resource: string | ResourceOptions
	token?: string
	getFullData?: boolean
}

interface TreeResult<T> extends Array<T> {
	truncated: boolean
}

export function viaContentsApi<T extends ListGithubDirOptions> (options: T):
	T['getFullData'] extends true ?
		Promise<any[]> :
		Promise<string[]>;

export function viaTreesApi<T extends ListGithubDirOptions> (options: T):
	T['getFullData'] extends true ?
		Promise<TreeResult<any>> :
		Promise<TreeResult<string>>;

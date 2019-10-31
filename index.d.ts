interface ListGithubDirContentOptions {
	user: string
	repository: string
	ref?: string
	directory: string
	token?: string
	getFullData?: boolean
}

interface TreeResult<T> extends Array<T> {
	truncated: boolean
}

type ViaContentsApi = <ProvidedOptions extends ListGithubDirContentOptions>(options: ProvidedOptions) =>
	ProvidedOptions['getFullData'] extends true ? Promise<any[]> : Promise<string[]>
type ViaTreesApi = <ProvidedOptions extends ListGithubDirContentOptions>(options: ProvidedOptions) =>
	ProvidedOptions['getFullData'] extends true ? Promise<TreeResult<any>> : Promise<TreeResult<string>>


declare const listContent: {
	viaTreesApi: ViaTreesApi,
	viaContentsApi: ViaContentsApi
}

export = listContent

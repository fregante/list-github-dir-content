interface ListGithubDirContentOptions {
	user: string
	repository: string
	ref?: string
	directory: string
	token: string
	getFullData?: boolean
}

function ListGithubDirContent<ProvidedOptions extends ListGithubDirContentOptions>(options: ProvidedOptions):
	ProvidedOptions['getFullData'] extends true ? Promise<any[]> : Promise<string[]>

export = {
	viaTreeApi: ListGithubDirContent,
	viaTreesApi: ListGithubDirContent,
	viaContentApi: ListGithubDirContent,
	viaContentsApi: ListGithubDirContent
}

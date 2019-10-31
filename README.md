# list-github-dir-content [![Build Status](https://travis-ci.org/fregante/list-github-dir-content.svg?branch=master)](https://travis-ci.org/fregante/list-github-dir-content)

> List all the files in a GitHub repo’s directory

## Install

```
$ npm install list-github-dir-content
```


## Usage

```js
const listContent = require('list-github-dir-content');

const myToken = '000'; // https://github.com/settings/tokens

// They have the same output
const filesArray = await listContent.viaTreesApi({
	user: 'microsoft',
	repository: 'vscode',
	directory: 'src',
	token: myToken
});
// OR
const filesArray = await listContent.viaContentsApi({
	user: 'microsoft',
	repository: 'vscode',
	directory: 'src',
	token: myToken
});
// OR
const filesArray = await listContent.viaContentsApi({
	user: 'microsoft',
	repository: 'vscode',
	ref: 'master',
	directory: 'src',
	token: myToken
});

// ['src/file.js', 'src/styles/main.css', ...]

// listContent.viaTreesApi also adds a `truncated` property
if (filesArray.truncated) {
	// Perhaps try with viaContentsApi?
}
```


## API

### listContent.viaTreesApi(options)
### listContent.viaContentsApi(options)

Both methods return a Promise that resolves with an array of all the files in the chosen directory. They just vary in GitHub API method used. The paths will be relative to root (i.e. if `directory` is `dist/images`, the array will be `['dist/images/1.png', 'dist/images/2.png']`)

`viaTreesApi` is preferred when there are a lot of nested directories. This will try to make a single HTTPS request **for the whole repo**, regardless of what directory was picked. On big repos this may be of a few megabytes. ([GitHub API v3 reference](https://developer.github.com/v3/git/trees/#get-a-tree-recursively))

`viaContentsApi` is preferred when you're downloading a small part of a huge repo. This will make a request for each subfolder requested, which may mean dozens or hundreds of HTTPS requests. ([GitHub API v3 reference](https://developer.github.com/v3/repos/contents/#get-contents))

**Notice:** while they work differently, they have the same output if no limit was reached.

Known issues:

- `viaContentsApi` is limited to 1000 files _per directory_
- `viaTreesApi` is limited to around 60,000 files _per repo_

The following properties are available on the `options` object: 

#### user

Type: `string`

GitHub user or organization, such as `microsoft`.

#### repository

Type: `string`

The user's repository to read, like `vscode`.

#### ref

Type: `string`

Default: `"HEAD"`

The reference to use, for example a pointer (`"HEAD"`), a branch name (`"master"`) or a commit hash (`"71705e0"`).

#### directory

Type: `string`

The directory to download, like `docs` or `dist/images`

#### token

Type: `string`

A GitHub personal token, get one here: https://github.com/settings/tokens

#### getFullData

Type: `boolean`

Default: `false`

When set to `true`, an array of metadata objects is returned instead of an array of file paths. Note that the metadata objects of `viaTreesApi` and `viaContentsApi` are different.

Take a look at the docs for either the [Git Trees API](https://developer.github.com/v3/git/trees/#response) and the [Contents API](https://developer.github.com/v3/repos/contents/#response) to see how the respective metadata is structured.


## License

MIT © [Federico Brigante](https://bfred.it)


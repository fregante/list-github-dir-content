# list-github-dir-content [![Build Status](https://travis-ci.org/bfred-it/list-github-dir-content.svg?branch=master)](https://travis-ci.org/bfred-it/list-github-dir-content)

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
const filesArray = await listContent.viaTreesApi('Microsoft/vscode', 'src', myToken);
// OR
const filesArray = await listContent.viaContentsApi('Microsoft/vscode', 'src', myToken);

// ['src/file.js', 'src/styles/main.css', ...]

// listContent.viaTreesApi also adds a `truncated` property
if (filesArray.truncated) {
	// Perhaps try with viaContentsApi?
}
```


## API

### listContent.viaTreesApi(repo, directory, token)
### listContent.viaContentsApi(repo, directory, token)

Both methods return a Promise that resolves with an array of all the files in the chosen directory. They just vary in GitHub API method used. The paths will be relative to root (i.e. if `directory` is `dist/images`, the array will be `['dist/images/1.png', 'dist/images/2.png']`)

`viaTreesApi` is preferred when there are a lot of nested directories. This will try to make a single HTTPS request **for the whole repo**, regardless of what directory was picked. On big repos this may be of a few megabytes. ([GitHub API v3 reference](https://developer.github.com/v3/git/trees/#get-a-tree-recursively))

`viaContentsApi` is preferred when you're downloading a small part of a huge repo. This will make a request for each subfolder requested, which may mean dozens or hundreds of HTTPS requests. ([GitHub API v3 reference](https://developer.github.com/v3/repos/contents/#get-contents))

**Notice:** while they work differently, they have the same output if no limit was reached.

Known issues:

- `viaContentsApi` is limited to 1000 files _per directory_
- `viaTreesApi` is limited to around 60,000 files _per repo_


#### repo

Type: `string`

The `user/repo` combination, such as `Microsoft/vscode`.

#### directory

Type: `string`

The directory to download, like `docs` or `dist/images`

#### token

Type: `string`

A GitHub personal token, get one here: https://github.com/settings/tokens

#### ref

Type: `string`

The name of the commit/branch/tag, default to `master`


## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)

# Shuji

Shuji is a Markdown to React JSX converter!

&nbsp;

## Why?

It was originally designed for being able to write blog files without the overhead of a framework like gatsby or jekyll.
Templating frameworks used to be very beneficial, but often come with their own complexities and the biggest problem : **you lose control over your build system.**
I got tired of waiting for bug-fixes, library updates, and having to work around their configurations. I just wanted an easy way to easily generate new blog articles without the overhead.

### Shuji lets you:

* Design and organize your own templates however you want.
* Configure your build system however you want. You can use webpack, parcel, rollup, or whatever you prefer.
* Easily and automatically generate new pages from markdown files.
* Converts Markdown files to JSX files, even including any html in the markdown.
* Extract front-matter metadata into a react context.

&nbsp;

## How it works

* It will convert `.md` files that you provide, generate a file with an exported react component.
  * front-matter is converted to a react context object.
  * The actual markdown content will be converted to JSX.

### Here's an example

input: `articles/simple.md`

```markdown
# Hello World

## test

This is a markdown test. Isn't markdown awesome?

### Reasons to use this

- It's awesome
- It's lightweight
- It doesn't replace your build pipeline.

```

output: `jsxPages/simple.jsx`

```js
export const Simple = () => {

    return (
        <div className='simple'>
            <h1>Hello World</h1>
			<h2>test</h2>
			<p>This is a markdown test. Isn&#x27;t markdown awesome?</p>
			<h3>Reasons to use this</h3>
			<ul>
			<li>It&#x27;s awesome</li>
			<li>It&#x27;s lightweight</li>
			<li>It doesn&#x27;t replace your build pipeline.</li>
			</ul>
        </div>
    )
}
```

&nbsp;

### Example with front matter

input: `articles/frontmatterexample.md`

```markdown
---
date: "2021-01-01"
title: node with react and redux
slug: node-react-redux
description: How to node with react and redux
tags:
- node
- react
- redux
---

# Node with react redux

## test

This with a test with yaml front matter.
Node react stuffs

### Reasons to use this

- It's awesome
- It's lightweight
- It doesn't replace your build pipeline.

#### The end
```


output: `jsxPages/frontmatterexample.jsx`

```js
export const Frontmatterexample = () => {

	const [shuji, setShuji] = useContext('ShujiContext')

	setShuji({
		...testObject,
		date = '2021-01-01',
		title = 'node with react and redux',
		slug = 'node-react-redux',
		description = 'How to node with react and redux',
		tags = ['node','react','redux'],
	})

    return (
        <div className='frontmatterexample'>
            <h1>Node with react redux</h1>
			<h2>test</h2>
			<p>This with a test with yaml front matter.

			Node react stuffs</p>
			<h3>Reasons to use this</h3>
			<ul>
			<li>It&#x27;s awesome</li>
			<li>It&#x27;s lightweight</li>
			<li>It doesn&#x27;t replace your build pipeline.</li>
			</ul>
			<h4>The end</h4>
        </div>
    )
}
```

&nbsp;

## Getting started

### Using Parcel

Install the parcel plugin
```
yarn add --dev parcel-plugin-shuji
or
npm install --dev parcel-plugin-shuji
```

Parcel will automatically look for `.md` files in the `./markdown` folder and compile them into the `./jsxMarkdown` folder.


You can configure several options by adding a `shuji.config.json` or `.shujirc.json` file in your **root directory** and parcel will automatically load it.

See options [below](##Config-Options)

&nbsp;

### Using Webpack

...coming soon~

&nbsp;

### Directly importing the library

Install Shuji
```
yarn add --dev shuji
or
npm install --dev shuji
```

Import the shuji `compile` method.

```js
import { compileMarkdown } from 'shuji'
```

Call the async method `compileMarkdown` which takes an `options` object and returns a `0` upon success or a `1` if there's an error.
See all the [properties](##Config-Options)


```js
const shujiOptions = {
    inputFolderPath: 'blogArticles',
    outputFolderPath: 'compiledArticles'
}

const isSuccessful = await compileMarkdown(shujiOptions)
```



&nbsp;

## Config Options

*   `inputFolderPath` (`string`, default: `'markdown'`)\
    Target Folder with `.md` files for Shuji to parse.
*   `outputFolderPath` (`string`, default: `'jsxMarkdown'`)\
    Output destination folder to write the compiled `.jsx` files.
*   `reactContextName` (`string`, default: `'ShujiContext'`)\
    The react context name in which any detected front-matter will be set through `useContext('${reactContextName}')`
*   `reactContextVarName` (`string`, default: `'shuji'`)\
    The name of the react context object and set method assigned from `useContext('${reactContextName}')`. ex. `const [${yourVar}, set${YourVar}]`.\
    __note__: first letter will be automatically be lower case for the object and upper-cased for the set method
*   `deleteExistingOutputFolder` (`boolean`, default: `false`)\
    Delete existing content in the output folder (`outputFolderPath`) before writing compiled files

&nbsp;

## Future features

* Webpack support

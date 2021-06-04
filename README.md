# Shuji

Shuji is a Markdown to React JSX converter!

&nbsp;

## What is Shuji?

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

&nbsp;

## Getting started


### **Option 1**: Use the shuji CLI

#### Install Shuji

```terminal
yarn add --dev shuji
or
npm install --dev shuji
```

### Create a yarn/npm script in your `package.json` to run shuji
package.json:
```json
{
    "scripts": {
        "buildjsx": "shuji -h"
    }
}
```

Alternatively, you can install shuji globally if you prefer not using yarn/npm `scripts`

### Run the `-h` help command to see [options](##Config-Options)

&nbsp;

### **Option 2**: Directly import the [package](https://www.npmjs.com/package/@ermish/shuji)

#### Install Shuji

```terminal
yarn add --dev shuji
or
npm install --dev shuji
```

### Transform all .md files in a directory

Import and call the async method `transformMarkdownFiles` which takes an `options` object and returns a `0` upon success or a `1` if there's an error.

```js
import { transformMarkdownFiles } from 'shuji'

const shujiOptions = {
    inputPath: 'blogArticles',
    outputPath: 'compiledArticles'
}

const isSuccessful = await transformMarkdownFiles(shujiOptions)
```

### Transform a markdown string

Call the async method `transformMarkdownFiles` which takes an `options` object and returns a react component `string` upon success or an `''` string if there's an error.

```js
import { transformMarkdownString } from 'shuji'

const myMarkdownString = getMyString()

const shujiOptions = {
    inputPath: 'blogArticles',
    outputPath: 'compiledArticles'
}

const jsxString = await transformMarkdownString(myMarkdownString, shujiOptions)
```

Check out the [properties](##Config-Options) of the `options` object.

&nbsp;

### **Option 3**: Use the [Parcel](https://parceljs.org/) plugin

#### Edit: Parcel plugin is currently unavailable

Install the parcel plugin

```terminal
yarn add --dev parcel-plugin-shuji
or
npm install --dev parcel-plugin-shuji
```

Parcel will automatically look for `.md` files in the `./markdown` folder and compile them into the `./jsxMarkdown` folder.

You can configure several options by adding a `shuji.config.json` or `.shujirc.json` file in your **root directory** and parcel will automatically load it.

See options [below](##Config-Options)

&nbsp;

### **Option 4**: Use the [Webpack](https://webpack.js.org/) plugin

...coming soon~

&nbsp;

## Examples

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
import { Helmet } from 'react-helmet'

export const Frontmatterexample = () => { 
  
    return (
        <div className='frontmatterexample'>
        	<Helmet>		
				<meta name="date" content="2021-01-01" />
				<title>node with react and redux</title>
				<meta name="slug" content="node-react-redux" />
				<meta name="description" content="How to node with react and redux" />
				<meta name="tags" content="node,react,redux" />
			</Helmet>	<h1>Node with react redux</h1>
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

If you set `useReactHelmet=false` enabling the reactHead format, it will output your front-matter using a react context like this:

```js
import { ReactHeadContext } from 'reactHead'

export const Frontmatterexample = () => { 
  
	const [reactHead, setReactHead] = useContext('ReactHeadContext')

	setReactHead({
		...reactHead,
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

Note: you will need to set up a custom module alias if your imported `reactHead` context is in another folder level.
You can add this to your `tsconfig.json` or `jsconfig.json`

&nbsp;

## Config Options

By default, no options are required.

*   `inputPath` (`string`, default: `'markdown'`)\
    Target folder or file with `.md` files for Shuji to parse.
*   `outputPath` (`string`, default: `'jsxMarkdown'`)\
    Output destination folder to write the compiled `.jsx` files.
*	`useReactHelmet` (`boolean`, default: `true`)\
    Toggle output style of front matter. true uses react helmet syntax. false will set react context values you have more control over. This is referred to as "reactHead"
*   `reactHeadContextName` (`string`, default: `'ReactHeadContext'`)\
    The reactHead context name in which any detected front-matter will be set through `useContext('${reactContextName}')`
*   `reactHeadContextVarName` (`string`, default: `'reactHead'`)\
    The name of the reactHead context object and set method assigned from `useContext('${reactContextName}')`. ex. `const [${yourVar}, set${YourVar}]`.\
    __note__: first letter will be automatically be lower case for the object and upper-cased for the set method
*   `deleteExistingOutputFolder` (`boolean`, default: `false`)\
    Delete existing content in the output folder (`outputFolderPath`) before writing compiled files
*   `logLevel` (`number`, default: `2`)\
    Set the log level. `1`=debug mode, `2`=default, `3`= no logs

&nbsp;

## Future features

* Improve docs for cli
* Fix parcel plugin
* Webpack support
* Improve logging

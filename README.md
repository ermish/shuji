# Shuji

![npm package version](https://img.shields.io/npm/v/@ermish/shuji)
![npm total downloads](https://img.shields.io/npm/dt/@ermish/shuji)
![license](https://img.shields.io/npm/l/@ermish/shuji)

&nbsp;

![Shuji Icon](https://github.com/Ermish/shuji/blob/main/shuji-icon.svg "Shuji Icon")

>Shuji is a Markdown to React JSX converter!
>It supports markdown including html, css, js, and even front-matter.

&nbsp;

## What is Shuji?

It was originally designed for being able to write blog files without the overhead of a framework like gatsby or jekyll.
Templating frameworks used to be very beneficial, but often come with their own complexities and the biggest problem: **you lose control over your build system.**
I got tired of waiting for bug-fixes, library updates, and having to work around their configurations. I just wanted an easy way to easily generate new blog articles without the overhead.

### Shuji lets you:

* Convert Markdown `.md` files to `.jsx` files. It supports html, css, and js within markdown and [front-matter support](##Front-Matter---How-does-it-work-in-Shuji?)
* Design and organize your own folder structure however you want
* Configure your build system however you want. You can use webpack, parcel, rollup, or whichever you prefer
* Easily and automatically generate new articles/pages from markdown files
* Extract front-matter metadata into a react context

&nbsp;

## How it works

* `.md` files within a provided folder (default: `/markdown`) will be converted to `.jsx` files containing an exported react functional component and generated in the provided output folder (default: `/jsxMarkdown`).
* If front-matter is detected, it is converted to [react helmet](https://www.npmjs.com/package/react-helmet) format by default or the alternative react context object format for improved customization.
  * See format examples [below](##Config-Options)
  * If you don't want to have Shuji parse front-matter, you can use a plugin to process it before Shuji runs.
* Shuji can be run through the CLI, as a library, or integration with your build tool (webpack, parcel, etc.)
  * You can choose to run it against a folder or feed the `.md` string directly to Shuji.

&nbsp;

## Getting started - Installation


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

### Run `shuji` with the `-h` help command to see the full list of CLI [options](##Config-Options)

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

## Front Matter - How does it work in Shuji?

#### What is front matter?
Front matter itself is a convention borrowed from books describing the title, contents, etc.
In code it represents the meta data around an article like title, date, author, description, etc.

#### Usage
Front matter can be written in `YAML` or `JSON` format at the beginning of each markdown file
Here's an example format:

```YAML
---
title: Hello World
date: 2013/7/13 20:46:25
---
```

```JSON
"title": "Hello World",
"date": "2013/7/13 20:46:25"
;;;
```

See the front-matter [example](###Example-with-front-matter) for the output

&nbsp;

## Examples

### Basic Markdown Example

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

### Example with front-matter
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
			</Helmet>
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

If you set `frontMatterMode='reactHead'` enabling the reactHead format, it will output your front-matter using a react context like this:

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
*	`frontMatterMode` (`string`, default: `reacthelmet`)\
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

## Front matter options

*   `react-component-name` (`string`)\
	For setting the react component name. Useful if you want to name your component something different than the filename. Useful if your file names begin with a date. Example: filename: `2030-02-02-shuji-is-awesome.md`, front matter:`react-component-name:shujiIsAwesome` output: `const ShujiIsAwesome = ...`
*   `title` (`string`)\
	For replacing the page title `<title>{shuji}</title>`
*   `description` (`string`)\
	Description for your post. `<meta name="description" content="{Shuji is awesome!}">`
*   `keywords` (`string`)\
	SEO Keywords for your post. `<meta name="keywords" content="{[shuji, react, markdown]}">`
*   `date` (`string`)\
	Published Date. No official html5 support tag, so placed in a meta tag `<meta name="date" content="{2030-01-01}">`
*   `tags` (`array`)\
	Tags to categorize your post. No official html5 support tag, so placed in a meta tag `<meta name="tags" content="{[shuji, react, markdown]}">`
*   `link` (`array`)\
	Permanent/canonical/pretty url for your post. Replaces `<link rel='canonical' href='{https://github.com/ermish/shuji}' />`
*   `your custom option` (`string`)\
	You can add any additional front matter and it will be placed a meta tag based on the name. `<meta name="hello" content="{world}">`

### React Helmet Mode (`frontMatterMode='reacthelmet'`):
These front matter options will be added to `<Helmet>{front matter options}</Helmet>`

### React Head Mode (`frontMatterMode='reacthead'`):
These front matter options will be added to a react context. 
This will not import `react-helmet` and will not set anything in the `<head>` section by default. This mode provides the ability to manage how you want to update the head.  

### Front matter disabled Mode (`frontMatterMode='none'`):
Front-matter will be ignored. 

&nbsp;

## Future features

* Fix parcel plugin
* Webpack support
* Improve logging

&nbsp;

## License

MIT

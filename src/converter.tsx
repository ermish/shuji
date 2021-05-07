import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import matter from 'gray-matter'
import { stringify } from 'json5'

interface File {
    fileName: string
    data: string
}

interface FrontMatterAndJSX {
    frontMatterJsxString: string
    jsxString: string
}
interface FrontMatterSplitFromMarkdown {
    frontMatterJsxString: string
    markdownString: string
}

/**
 * Converts Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string[]} `markdownFiles` Markdown strings to convert that may also include front-matter and html.
 * @param {string} `outputFolderPath` Front matter to stringify.
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<JsxFiles>} Files containing jsx
 */
export const convertMarkdownFilesToJSXFiles = async (markdownFiles: File[], reactContextVarName: string, reactContextName: string): Promise<File[]> => {
    const files = await Promise.all(
        markdownFiles.map(async file => {
            const frontMatterAndMarkdown = extractFrontMatter(file.data, reactContextVarName, reactContextName)
            const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
            const reactComponentString = createJsxComponentString(file.fileName, jsxString, frontMatterAndMarkdown.frontMatterJsxString)
            return { fileName: file.fileName, data: reactComponentString }
        })
    )

    return files
}

/**
 * Converts Markdown to JSX, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string[]} `markdownStrings` Markdown strings to convert that may also include front-matter and html.
 * @param {string} `outputFolderPath` Front matter to stringify.
 * @param {string} `reactContextVarName` name of react context variable name to assign front-matter variables to. like [shuji, setShuji] = useContext(...)
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<FrontMatterAndJSX>} Front matter and Markdown JSX strings
 */
export const convertMarkdownToJSX = async (markdownString: string, reactContextVarName: string, reactContextName: string): Promise<FrontMatterAndJSX> => {
    const frontMatterAndMarkdown = extractFrontMatter(markdownString, reactContextVarName, reactContextName)
    const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)

    return {
        frontMatterJsxString: frontMatterAndMarkdown.frontMatterJsxString,
        jsxString: jsxString
    }
}

const convertMarkdownAndHtmlToJsx = (markdownString: string): string => {
    try {
        const jsxString = renderToStaticMarkup(<ReactMarkdown children={markdownString}  />)
        const jsxStringWithTabs = jsxString.replace(/(\n|\r)/g, c => c + '\t\t\t')
        return jsxStringWithTabs
    } catch (error) {
        console.log(`error converting markdown to jsx: ${error}`)
        throw new error()
    }
}

const extractFrontMatter = (stringWithFrontMatter: string, reactContextVarName: string, reactContextName: string): FrontMatterSplitFromMarkdown => {
    try {
        const { data, content } = matter(stringWithFrontMatter)
        const frontMatterJsxString = createFrontMatterJSXString(data, reactContextVarName, reactContextName)

        return {
            frontMatterJsxString: frontMatterJsxString,
            markdownString: content
        }
    } catch (error) {
        console.log(`failed to extract front matter: ${error}`)
        throw new error()
    }
}

const createFrontMatterJSXString = (propsToAssign: Object, reactContextVarName: string, reactContextName: string): string => {
    if(Object.keys(propsToAssign).length < 1)
        return ''

    //Example
    // const [metadata, setMetadata] = useContext('TestContext')
    // setMetadata({
    //     ...metadata,
    //     date = '2021-01-01',
	//     title = 'node is cool',
	//     slug = 'node-is-cool',
	//     description = 'How to node',
	//     tags = ['node','cool','shuji']
    // })

    const setContextVarName = 'set' + reactContextVarName.replace(/^\w/, c => c.toUpperCase())
    const camelCasedVarName = reactContextVarName.replace(/^\w/, c => c.toLowerCase())

    let propAssignmentString = ''

    for (const propName in propsToAssign) {
        const propValue = propsToAssign[propName as keyof Object]
        let propValueStringified = stringify(propValue)

        propAssignmentString += `\t\t${propName} = ${propValueStringified}, \n`
    }

    let contextAssignmentString = `\n\tconst [${camelCasedVarName}, ${setContextVarName}] = useContext('${reactContextName}')`
    contextAssignmentString += '\n\n\tsetMetadata({' + `\n\t\t...${camelCasedVarName},` + `\n${propAssignmentString}` + `\n\t})\n`

    return contextAssignmentString
}

const createJsxComponentString = (componentName: string, reactString: string, frontMatterString?: string): string => {
   const capitalizedMethodName = componentName.replace(/^\w/, c => c.toUpperCase())
   const camelCasedComponentName = componentName.replace(/^\w/, c => c.toLowerCase())
    let reactComponent = `export const ${capitalizedMethodName} = () => { \n ${frontMatterString}
    return (
        <div className='${camelCasedComponentName}'>
            ${reactString}
        </div>
    )\n}`

    return reactComponent
}

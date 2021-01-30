import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdownWithHtml from 'react-markdown/with-html'
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
export const convertMarkdownFilesToJSXFiles = async (markdownFiles: File[], useReactHelmetFormat: boolean, reactContextName?: string): Promise<File[]> => {
    const files = await Promise.all(
        markdownFiles.map(async file => {
            const frontMatterAndMarkdown = extractFrontMatter(file.data, reactContextName)
            const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
            const reactComponentString = createJsxComponentString(file.fileName, jsxString, useReactHelmetFormat, frontMatterAndMarkdown.frontMatterJsxString)
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
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<FrontMatterAndJSX>} Front matter and Markdown JSX strings
 */
export const convertMarkdownToJSX = async (markdownString: string, reactContextName?: string): Promise<FrontMatterAndJSX> => {
    const frontMatterAndMarkdown = extractFrontMatter(markdownString, reactContextName)
    const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)

    return {
        frontMatterJsxString: frontMatterAndMarkdown.frontMatterJsxString,
        jsxString: jsxString
    }
}

const convertMarkdownAndHtmlToJsx = (markdownString: string): string => {
    try {
        const jsxString = renderToStaticMarkup(<ReactMarkdownWithHtml children={markdownString} allowDangerousHtml />)
        return jsxString
    } catch (error) {
        console.log(`error converting markdown to jsx: ${error}`)
        throw new error()
    }
}

const extractFrontMatter = (stringWithFrontMatter: string, useReactHelmetFormat: boolean, reactContextName?: string): FrontMatterSplitFromMarkdown => {
    try {
        const { data, content } = matter(stringWithFrontMatter)
        const frontMatterJsxString = createFrontMatterJSXString(data, useReactHelmetFormat, reactContextName)

        return {
            frontMatterJsxString: frontMatterJsxString,
            markdownString: content
        }
    } catch (error) {
        console.log(`failed to extract front matter: ${error}`)
        throw new error()
    }
}

const createFrontMatterJSXString = (propsToAssign: Object, useReactHelmetFormat: boolean, existingContextName?: string): string => {
    const contextName = existingContextName ?? 'ShujiContext'

    // Create new context if it doesn't exist
    // const createContextString = existingContextName
    //     ? `export const ${contextName} = React.createContext();`
    //     : ''

    if(Object.keys(propsToAssign).length < 1)
        return ''

    let propAssignmentString = ''

    for (const propName in propsToAssign) {
        const propValue = propsToAssign[propName as keyof Object]
        let propValueStringified = stringify(propValue)
      

        useReactHelmetFormat 
            ? propAssignmentString += `\t ${contextName}.${propName} = ${propValueStringified} \n`
            : propAssignmentString += `\t ${contextName}.${propName} = ${propValueStringified} \n`

        propAssignmentString += `\t ${contextName}.${propName} = ${propValueStringified} \n`
    }

    return propAssignmentString
}

const createJsxComponentString = (componentName: string, reactString: string, useReactHelmetFormat: boolean, frontMatterString?: string): string => {
   const capitalizedName = componentName.replace(/^\w/, c => c.toUpperCase())
   const camelCasedName = componentName.replace(/^\w/, c => c.toLowerCase())
    let reactComponent = `export const ${capitalizedName} = () => { \n${useReactHelmetFormat ? '' : frontMatterString}
    return ( 
        <div className='${camelCasedName}'>
            ${useReactHelmetFormat ? frontMatterString : ''}
            ${reactString}
        </div>
    )\n}`
   
    return reactComponent
}

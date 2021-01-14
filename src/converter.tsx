import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdownWithHtml from 'react-markdown/with-html'
import gfm from 'remark-gfm'
import matter from 'gray-matter'

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
export const convertMarkdownFilesToJSXFiles = async (markdownFiles: File[], reactContextName?: string): Promise<File[]> => {
    const files = await Promise.all(
        markdownFiles.map(async file => {
            const frontMatterAndMarkdown = extractFrontMatter(file.data, reactContextName)
            const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
            return { fileName: file.fileName, data: jsxString }
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
    let markdownJsx = ''
    try {
        // @ts-ignore
        const jsxString = renderToStaticMarkup(<ReactMarkdownWithHtml children={mdFileMarkdownString} allowDangerousHtml />, markdownJsx)
    } catch (error) {
        console.log(`error converting markdown to jsx: ${error}`)
        throw new error()
    }

    return markdownJsx
}

const extractFrontMatter = (stringWithFrontMatter: string, reactContextName?: string): FrontMatterSplitFromMarkdown => {
    try {
        const { data, content } = matter(stringWithFrontMatter)
        const frontMatterJsxString = createFrontMatterJSXString(data, reactContextName)

        return {
            frontMatterJsxString: frontMatterJsxString,
            markdownString: content
        }
    } catch (error) {
        console.log(`failed to extract front matter: ${error}`)
        throw new error()
    }
}

const createFrontMatterJSXString = (propsToAssign: Object, existingContextName?: string): string => {
    const contextName = existingContextName ?? 'ShujiContext'

    const createContextString = existingContextName
        ? `
        export const ${contextName} = React.createContext(
            ...variables
        );
    `
        : ''

    const propAssignmentString = `
        for (const propName in propsToAssign) {
            window[contextName][propName] = propsToAssign[propName as keyof Object];
        }
    `

    const jsxString = createContextString + propAssignmentString
    return jsxString
}

import { convertMarkdownFilesToJSXFiles, convertMarkdownToJSX } from './converter'
import { getMdFilesFromFolder, writeJsxFiles } from './fileProcessor'

export interface Options {
    inputPath?: string
    outputPath?: string
    reactContextName?: string
    reactContextVarName?: string
    deleteExistingOutputFolder?: boolean
}

export const defaultOptions = {
    inputPath: 'markdown',
    outputPath: 'jsxMarkdown',
    reactContextName: 'ShujiContext',
    reactContextVarName: 'shuji',
    deleteExistingOutputFolder: false
}

/**
 * Transforms a Markdown string to JSX, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string} `markdownString` Markdown string to convert to a react component that may also include front-matter and html.
 * @param {componentName} `componentName` Name of new react component.
 * @param {Options} User defined options to override default values.
 * @return {Promise<number>} files
 */
 export const transformMarkdownString = async (markdownString: string, componentName: string, options?: Options): Promise<string> => {
    try {
        const userOptions = {
            ...defaultOptions,
            ...options
        }

        const jsxString = await convertMarkdownToJSX(markdownString, componentName, userOptions.reactContextVarName, userOptions.reactContextName)

        return jsxString
    } catch (error) {
        return ''
    }
}


/**
 * Transforms Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {Options} User defined options to override default values.
 * @return {Promise<number>} files
 */
export const transformMarkdownFiles = async (options?: Options): Promise<number> => {
    try {
        const userOptions = {
            ...defaultOptions,
            ...options
        }

        const mdFiles = await getMdFilesFromFolder(userOptions.inputPath)
        const jsxStrings = await convertMarkdownFilesToJSXFiles(mdFiles, userOptions.reactContextVarName, userOptions.reactContextName)
        await writeJsxFiles(userOptions.outputPath, jsxStrings, userOptions.deleteExistingOutputFolder)

        return 0
    } catch (error) {
        return 1
    }
}

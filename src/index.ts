import { convertMarkdownFilesToJSXFiles } from './converter'
import { getMdFilesFromFolder, writeJsxFiles } from './fileProcessor'

interface Options {
    inputFolderPath?: string
    outputFolderPath?: string
    reactContextName?: string
    reactContextVarName?: string
    deleteExistingOutputFolder?: boolean
}

export const defaultOptions = {
    inputFolderPath: 'pages',
    outputFolderPath: 'jsxPages',
    reactContextName: 'ShujiContext',
    reactContextVarName: 'shuji',
    deleteExistingOutputFolder: false
}

/**
 * Converts Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {Options} User defined options to override default values.
 * @return {Promise<JsxFiles>} files
 */
export const compile = async (options?: Options): Promise<number> => {
    try {
        const userOptions = {
            ...defaultOptions,
            ...options
        }

        const mdFiles = await getMdFilesFromFolder(userOptions.inputFolderPath)
        const jsxStrings = await convertMarkdownFilesToJSXFiles(mdFiles, userOptions.reactContextVarName, userOptions.reactContextName)
        await writeJsxFiles(userOptions.outputFolderPath, jsxStrings, userOptions.deleteExistingOutputFolder)

        return 0
    } catch (error) {
        return 1
    }
}

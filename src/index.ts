import { convertMarkdownFilesToJSXFiles } from './converter'
import { getMdFilesFromFolder, writeJsxFiles } from './fileProcessor'

interface Options {
    inputFolderPath?: string,
    outputFolderPath?: string,
    reactContextName?: string
}

const defaultOptions = {
    inputFolderPath: 'pages',
    outputFolderPath: 'jsxPages',
    reactContextName: 'shuji',
}

  /**
   * Converts Markdown files to JSX files, including any html in the markdown.
   * Also, front-matter will be extracted in js variables in the react component.
   * @param {string} `inputFolderPath` path to folder to convert markdown files
   * @param {string} `outputFolderPath` path to folder for outputting .jsx files
   * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
   * @return {Promise<JsxFiles>} files 
   */
  export const compile = async (options?: Options) : Promise<number> => {
    try {
        const userOptions = {
            ...defaultOptions,
            ...options
        }

        const mdFiles = await getMdFilesFromFolder(userOptions.inputFolderPath)
        const jsxStrings = await convertMarkdownFilesToJSXFiles(mdFiles, userOptions.reactContextName)
        await writeJsxFiles(userOptions.outputFolderPath, jsxStrings)

        return 1    
    } catch (error) {
        return 0
    }
}
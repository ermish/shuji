import { promises } from 'fs'
import { extname, basename } from 'path'

import { logger } from './logger'

type File = {
    fileName: string
    data: string
}

export const getMdFilesFromFolder = async (path: string): Promise<File[]> => {
    let mdFiles: File[] = []

    try {
        const pathStat = await promises.lstat(path)
        const isPathADirectory = pathStat.isDirectory()

        const fileNamesInDir =  isPathADirectory
            ? await promises.readdir(path)
            : [basename(path)]

        if (fileNamesInDir.length < 1) {
            logger().warn(`No .md files found in '${path}'`)
            return mdFiles
        }

        logger().info(`Processing ${fileNamesInDir.length} file${fileNamesInDir.length > 1 ? 's' : ''} from "${path}"...`)

        mdFiles = await fileNamesInDir.reduce(async (validFilesPromise: Promise<File[]>, fileName: string) => {
            const validFiles = await validFilesPromise

            if (extname(fileName) != '.md') return validFiles

            const filePath = isPathADirectory ? `${path}/${fileName}` : path
            const fileData = await promises.readFile(filePath)
            validFiles.push({ fileName: basename(fileName, '.md'), data: fileData.toString() })

            return validFiles
        }, Promise.resolve([]))
    } catch (err) {
        logger().warn(`No .md files found in inputPath: '${path}'`)
    }

    return mdFiles
}

export const writeJsxFiles = async (folderPath: string, jsxFiles: File[], deleteExistingOutputFolder: boolean): Promise<void> => {
    try {
        if(jsxFiles.length <= 0)
            return

        if(deleteExistingOutputFolder)
            await promises.rmdir(folderPath)

        logger().info(`Generating ${jsxFiles.length} file${jsxFiles.length > 1 ? 's' : ''} in "${folderPath}"...`)


        await promises.mkdir(folderPath, { recursive: true })
        await Promise.all(
            jsxFiles.map(async jsxFile => {
                await promises.writeFile(`${folderPath}/${jsxFile.fileName}.jsx`, jsxFile.data, 'utf8')
            })
        )
    } catch (error) {
        logger().error(`error writing markdown files: ${error}`)
    }
}

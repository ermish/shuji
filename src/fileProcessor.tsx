import { promises } from 'fs'
import { extname, basename } from 'path'

type File = {
    fileName: string
    data: string
}

export const getMdFilesFromFolder = async (folderPath: string): Promise<File[]> => {
    let mdFiles: File[] = []

    try {
        const fileNamesInDir = await promises.readdir(folderPath)

        if (fileNamesInDir.length < 1) {
            console.log(`Shuji: No .md files found in folder '${folderPath}'`)
            return mdFiles
        }

        console.log(`Shuji: Processing ${fileNamesInDir.length} files...`)

        mdFiles = await fileNamesInDir.reduce(async (validFilesPromise: Promise<File[]>, fileName: string) => {
            const validFiles = await validFilesPromise

            if (extname(fileName) != '.md') return validFiles

            const fileData = await promises.readFile(`${folderPath}/${fileName}`)
            validFiles.push({ fileName: basename(fileName, '.md'), data: fileData.toString() })
        
            return validFiles
        }, Promise.resolve([]))
    } catch (err) {
        console.log(`Shuji: error retrieving files from '${folderPath}': ${err}`)
    }

    return mdFiles
}

export const writeJsxFiles = async (folderPath: string, jsxFiles: File[]): Promise<void> => {
    try {
        await Promise.all(
            jsxFiles.map(async jsxFile => {
                await promises.mkdir(folderPath, { recursive: true })
                await promises.writeFile(`${folderPath}/${jsxFile.fileName}.jsx`, jsxFile.data, 'utf8')
            })
        )
    } catch (error) {
        console.log(`Shuji: error writing markdown files: ${error}`)
    }
}

import { writeFile } from 'fs-extra'
import { readdir } from 'fs'
import { extname, basename } from 'path'

type File = {
    fileName: string
    data: string
}

export const getMdFilesFromFolder = async (folderPath: string) : Promise<File[]> => {
    const files : File[] = []
    
    try {
        readdir(folderPath, (err, filesInDir) => {
            if(err) {
                console.log(`Shuji: error retrieving files from '${folderPath}': ${err}`)
                return
            }

            if(filesInDir.length < 1) {
                console.log(`Shuji: No .md files found in folder '${folderPath}'`)
                return
            }
            
            console.log(`Shuji: Processing ${filesInDir.length} files...`)

            filesInDir.map(file => {
                if(extname(file) != '.md') 
                    return
                
                files.push({ fileName: basename(file), data: file })
            })            
         })     
    } catch (err) {
        console.log(`Shuji: No .md files found in folder ${folderPath}`)
    }

    return files
}

export const writeJsxFiles = async (folderPath: string, jsxFiles: File[]) : Promise<void> => {
    try {
        await Promise.all(jsxFiles.map(async jsxFile => {
            await writeFile(folderPath, jsxFile, 'utf8')
        }))
    } catch (error) {
        console.log(`Shuji: error writing markdown files: ${error}`)
    }
}

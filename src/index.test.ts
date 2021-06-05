import { getMdFilesFromFolder } from './fileProcessor'
import { transformMarkdownFiles, transformMarkdownString, defaultOptions } from '.'
import { existsSync } from 'fs'
import { promises } from 'fs'

const testData = {
    testInputFolder: './src/samples',
    testOutputFolder: './src/testoutput',
    testReactContextName :'TestContext',
    testReactContextVarName :'testObject'
}

describe('transformMarkdownFiles', () => {
    test('works with a folder and multiple files', async () => {
        const result = await transformMarkdownFiles({ inputPath: testData.testInputFolder })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/frontmatterexample.jsx`)).toBeTruthy()

        await cleanup(defaultOptions.outputPath)
    })

    test('works with a single file path', async () => {
        const result = await transformMarkdownFiles({ inputPath: `${testData.testInputFolder}/simple.md` })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/simple.jsx`)).toBeTruthy()

        await cleanup(defaultOptions.outputPath)
    })

    test('output folder can be changed', async () => {
        const result = await transformMarkdownFiles({ inputPath: testData.testInputFolder, outputPath: testData.testOutputFolder })

        expect(result).toEqual(0)

        expect(existsSync(testData.testOutputFolder)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/frontmatterexample.jsx`)).toBeTruthy()

        await cleanup(testData.testOutputFolder)
    })
})

describe('transformMarkdownString', () => {
    test('works', async () => {
        const mdFiles = await getMdFilesFromFolder(testData.testInputFolder)
        const firstFile = mdFiles[0]

        const result = await transformMarkdownString(firstFile.data, firstFile.fileName)

        expect(result).not.toBeNull()
    })
})

describe('front matter tests', () => {
    test('react context can be changed', async () => {
        const result = await transformMarkdownFiles({ inputPath: testData.testInputFolder, reactHeadContextName: testData.testReactContextName })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await promises.readFile(`${defaultOptions.outputPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter.toString()).toContain(testData.testReactContextName)

        await cleanup(defaultOptions.outputPath)
    })

    test('react context variable is properly set', async () => {

        const result = await transformMarkdownFiles({ inputPath: testData.testInputFolder, reactHeadContextName: testData.testReactContextName, reactHeadContextVarName: testData.testReactContextVarName })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await promises.readFile(`${defaultOptions.outputPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter.toString()).toContain(testData.testReactContextName)
        const varNameWithCapitalLetter = testData.testReactContextVarName.replace(/^\w/, c => c.toUpperCase())
        expect(fileWithFrontMatter.toString()).toContain(`[${testData.testReactContextVarName}, set${varNameWithCapitalLetter}]`)

        await cleanup(defaultOptions.outputPath)
    })
})



const cleanup = async (folderPath:string) => {
    //Cleanup test files/folders
    await promises.rmdir(`${folderPath}`,{ recursive:true } )
}

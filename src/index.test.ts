import { compileMarkdown, defaultOptions } from '.'
import { existsSync } from 'fs'
import { promises } from 'fs'

const testData = {
    testInputFolder: './src/samples',
    testOutputFolder: './src/testoutput',
    testReactContextName :'TestContext',
    testReactContextVarName :'testObject'
}

describe('compile', () => {
    test('works', async () => {
        const result = await compileMarkdown({ inputFolderPath: testData.testInputFolder })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()

        await cleanup(defaultOptions.outputFolderPath)
    })

    test('output folder can be changed', async () => {
        const result = await compileMarkdown({ inputFolderPath: testData.testInputFolder, outputFolderPath: testData.testOutputFolder })

        expect(result).toEqual(0)

        expect(existsSync(testData.testOutputFolder)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${testData.testOutputFolder}/frontmatterexample.jsx`)).toBeTruthy()

        await cleanup(testData.testOutputFolder)
    })
})

describe('front matter tests', () => {
    test('react context can be changed', async () => {

        const result = await compileMarkdown({ inputFolderPath: testData.testInputFolder, reactContextName: testData.testReactContextName })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await promises.readFile(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter.toString()).toContain(testData.testReactContextName)

        await cleanup(defaultOptions.outputFolderPath)
    })

    test('react context variable is properly set', async () => {

        const result = await compileMarkdown({ inputFolderPath: testData.testInputFolder, reactContextName: testData.testReactContextName, reactContextVarName: testData.testReactContextVarName })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await promises.readFile(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter.toString()).toContain(testData.testReactContextName)
        const varNameWithCapitalLetter = testData.testReactContextVarName.replace(/^\w/, c => c.toUpperCase())
        expect(fileWithFrontMatter.toString()).toContain(`[${testData.testReactContextVarName}, set${varNameWithCapitalLetter}]`)

        await cleanup(defaultOptions.outputFolderPath)
    })
})



const cleanup = async (folderPath:string) => {
    //Cleanup test files/folders
    await promises.rmdir(`${folderPath}`,{ recursive:true } )
}

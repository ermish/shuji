import { compile, defaultOptions } from './index'
import { existsSync } from 'fs'
import { promises } from 'fs'

const testData = {
    testInputFolder: './src/samples',
    testOutputFolder: './src/testoutput',
    testReactContextName :'TestContext'
}

describe('compile', () => {
    test('works', async () => {
        const result = await compile({ inputFolderPath: testData.testInputFolder })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
    })

    test('output folder can be changed', async () => {
        const result = await compile({ inputFolderPath: testData.testInputFolder, outputFolderPath: testData.testOutputFolder })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/codeexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/simple.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
    })

    test('react context can be changed', async () => {

        const result = await compile({ inputFolderPath: testData.testInputFolder, reactContextName: testData.testReactContextName })

        expect(result).toEqual(0)

        expect(existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await promises.readFile(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter.toString()).toContain('TestContext.slug')
    })
})

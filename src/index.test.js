import { compile, defaultOptions } from './index'
import { existsSync, readFile, } from 'fs'

describe('compile', () => {
    test('works', async () => {
        const testFolder = '/samples'

        const result = await compile({ inputFolderPath: testFolder })

        expect(result).toEqual(0)

        expect(fs.existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/codeexample.jsx`)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/simple.jsx`)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()


    })

    test('output folder can be changed', async () => {
        const testInputFolder = '/samples'
        const testOutputFolder = '/testoutput'

        const result = await compile({ inputFolderPath: testInputFolder, outputFolderPath: testOutputFolder })

        expect(result).toEqual(0)

        expect(fs.existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/codeexample.jsx`)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/simple.jsx`)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
    })

    test('react context can be changed', async () => {
        const testFolder = '/samples'
        const testReactContextName = 'TestContext'

        const result = await compile({ inputFolderPath: testFolder, reactContextName: testReactContextName })

        expect(result).toEqual(0)

        expect(fs.existsSync(defaultOptions.outputFolderPath)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()
        expect(fs.existsSync(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)).toBeTruthy()

        const fileWithFrontMatter = await readFile(`${defaultOptions.outputFolderPath}/frontmatterexample.jsx`)

        expect(fileWithFrontMatter.length).toBeGreaterThan(1)
        expect(fileWithFrontMatter).toContain('TestContext.slug')
    })
})
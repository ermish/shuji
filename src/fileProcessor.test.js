import { getMdFilesFromFolder } from './fileProcessor'


describe('file processor', () => {
    test('it can open files from a directory', async () => {
        const folder = '/samples'

        const files = await getMdFilesFromFolder({ inputFolderPath: folder })

        expect(files).toHaveLength(3)
        expect(files[0]).not.toBeNull()
    })
})
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import { stringify } from 'json5'

import { logger } from './logger'

interface File {
    fileName: string
    data: string
}

interface FrontMatterAndJSX {
    frontMatterJsxString: string
    jsxString: string
}
interface FrontMatterSplitFromMarkdown {
    frontMatterJsxString: string
    markdownString: string
}

/**
 * Converts Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string[]} `markdownFiles` Markdown strings to convert that may also include front-matter and html.
 * @param {string} `outputFolderPath` Front matter to stringify.
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<JsxFiles>} Files containing jsx
 */
export const convertMarkdownFilesToJSXFiles = async (markdownFiles: File[], useReactHelmet:boolean, reactContextVarName: string, reactContextName: string): Promise<File[]> => {
    const files = await Promise.all(
        markdownFiles.map(async file => {
            const frontMatterAndMarkdown = extractFrontMatter(file.data, useReactHelmet, reactContextVarName, reactContextName)
            const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
            const reactComponentString = createJsxComponentString(file.fileName, jsxString, useReactHelmet, frontMatterAndMarkdown.frontMatterJsxString, reactContextName)
            return { fileName: file.fileName, data: reactComponentString }
        })
    )

    return files
}

/**
 * Converts Markdown to JSX, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string} `markdownString` Markdown string to convert to a react component that may also include front-matter and html.
 * @param {componentName} `componentName` Name of new react component.
 * @param {string} `reactContextVarName` name of react context variable name to assign front-matter variables to. like [shuji, setShuji] = useContext(...)
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<string>} Front matter and Markdown JSX strings
 */
export const convertMarkdownToJSX = async (markdownString: string, componentName: string, useReactHelmet:boolean, reactContextVarName: string, reactContextName: string): Promise<string> => {
    const frontMatterAndMarkdown = extractFrontMatter(markdownString, useReactHelmet, reactContextVarName, reactContextName)
    const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
    const reactComponentString = createJsxComponentString(componentName, jsxString, useReactHelmet, frontMatterAndMarkdown.frontMatterJsxString, reactContextName)

    return reactComponentString
}

const convertMarkdownAndHtmlToJsx = (markdownString: string): string => {
    try {
        const jsxString = renderToStaticMarkup(<ReactMarkdown children={markdownString}  />)
        const jsxStringWithTabs = jsxString.replace(/(\n|\r)/g, c => c + '\t\t\t')
        return jsxStringWithTabs
    } catch (error) {
        logger().error(`error converting markdown to jsx: ${error}`)
        throw new error()
    }
}

const extractFrontMatter = (stringWithFrontMatter: string, useReactHelment:boolean, reactContextVarName?: string, reactContextName?: string): FrontMatterSplitFromMarkdown => {
    try {
        const { data, content } = matter(stringWithFrontMatter)
        const frontMatterJsxString = createFrontMatterJSXString(data, useReactHelment, reactContextVarName, reactContextName)

        return {
            frontMatterJsxString: frontMatterJsxString,
            markdownString: content
        }
    } catch (error) {
        logger().error(`failed to extract front matter: ${error}`)
        throw new error()
    }
}

const createFrontMatterJSXString = (propsToAssign: Object, useReactHelment: boolean, reactContextVarName?: string, reactContextName?: string): string => {
    if(Object.keys(propsToAssign).length < 1)
        return ''

    if(useReactHelment == false) {
        return createReactHeadString(propsToAssign, reactContextVarName as string, reactContextName as string)
    }

    return createReactHelmentElements(propsToAssign)
}

const createJsxComponentString = (componentName: string, reactString: string, useReactHelmet:boolean, frontmatterString: string, reactContextName?: string): string => {
    const capitalizedMethodName = componentName.replace(/^\w/, c => c.toUpperCase())
    const camelCasedComponentName = componentName.replace(/^\w/, c => c.toLowerCase())

    let reactComponent = `${frontmatterString ? useReactHelmet ? `import { Helmet } from 'react-helmet'\n\n` : `import { ${reactContextName} } from 'reactHead'\n\n` : ''}`
    + `const ${capitalizedMethodName} = () => { \n  ${useReactHelmet ? '' : frontmatterString}
    return (
        <div className='${camelCasedComponentName}'>
        ${useReactHelmet ? frontmatterString : ''}\t${reactString}
        </div>
    )\n}
    \nexport default ${capitalizedMethodName}`

     return reactComponent
 }


const createReactHelmentElements = (propsToAssign: Object) : string => {
    if(!propsToAssign) {
        return ''
    }

    let propAssignmentString = ''

    for (const propName in propsToAssign) {
        const propValue = propsToAssign[propName as keyof Object]
        //clean up arrays
        let propValueStringified = stringify(propValue).replace(/]|[|'[]/g, '')

        switch (propName) {
            case 'title':
                propAssignmentString += `\n\t\t\t\t<title>${propValueStringified}</title>`
                break;
            case 'description':
                propAssignmentString += `\n\t\t\t\t<meta name="description" content="${propValueStringified}" />`
                break;
            case 'author':
                propAssignmentString += `\n\t\t\t\t<meta name="author" content="${propValueStringified}" />`
                break;
            case 'keywords':
                propAssignmentString += `\n\t\t\t\t<meta name="keywords" content="${propValueStringified}" />`
                break;
            default:
                propAssignmentString += `\n\t\t\t\t<meta name="${propName}" content="${propValueStringified}" />`
                break;
        }
    }

    const reactHelmetString =
    `\t<Helmet>`
        + `\t\t${propAssignmentString}`
    + `\n\t\t\t</Helmet>`

    return reactHelmetString
}

const createReactHeadString = (propsToAssign: Object, reactContextVarName: string, reactContextName: string) : string => {
    if(!propsToAssign) {
        return ''
    }

    //Example
    // const [metadata, setMetadata] = useContext('TestContext')
    // setMetadata({
    //     ...metadata,
    //     date = '2021-01-01',
	//     title = 'node is cool',
	//     slug = 'node-is-cool',
	//     description = 'How to node',
	//     tags = ['node','cool','shuji']
    // })

    const setContextVarName = 'set' + reactContextVarName.replace(/^\w/, c => c.toUpperCase())
    const camelCasedVarName = reactContextVarName.replace(/^\w/, c => c.toLowerCase())

    let propAssignmentString = ''

    for (const propName in propsToAssign) {
        const propValue = propsToAssign[propName as keyof Object]
        let propValueStringified = stringify(propValue)

        propAssignmentString += `\t\t${propName} = ${propValueStringified}, \n`
    }

    const contextAssignmentString =
    `\n\tconst [${camelCasedVarName}, ${setContextVarName}] = useContext('${reactContextName}')`
    + `\n\n\t${setContextVarName}({`
        + `\n\t\t...${camelCasedVarName},`
        + `\n${propAssignmentString}`
    + `\n\t})\n`

    return contextAssignmentString
}


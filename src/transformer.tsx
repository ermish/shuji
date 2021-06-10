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

interface FrontMatterSplitFromMarkdown {
    frontMatterJsxString?: string
    frontMatterObject?: any
    markdownString: string
    componentNameFromFrontMatter?: string
}

export enum frontMatterModeEnum {
    object = 'object',
    reactHead = 'reacthead',
    reactHelmet = 'reacthelmet',
    none = 'none'
}

/**
 * Converts Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string[]} `markdownFiles` Markdown strings to convert that may also include front-matter and html.
 * @param {string} `outputFolderPath` Front matter to stringify.
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise<JsxFiles>} Files containing jsx
 */
export const convertMarkdownFilesToJSXFiles = async (markdownFiles: File[], frontMatterMode: frontMatterModeEnum, reactContextVarName: string, reactContextName: string): Promise<File[]> => {
    const files = await Promise.all(
        markdownFiles.map(async file => {
            const frontMatterAndMarkdown = extractFrontMatter(file.data, frontMatterMode, reactContextVarName, reactContextName)
            const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
            const reactComponentString = createJsxComponentString(frontMatterAndMarkdown.componentNameFromFrontMatter ?? file.fileName, jsxString, frontMatterMode, frontMatterAndMarkdown.frontMatterJsxString, frontMatterAndMarkdown.frontMatterObject, reactContextName)
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
export const convertMarkdownToJSX = async (markdownString: string, frontMatterMode: frontMatterModeEnum, reactContextVarName: string, reactContextName: string, componentName?: string): Promise<string> => {
    const frontMatterAndMarkdown = extractFrontMatter(markdownString, frontMatterMode, reactContextVarName, reactContextName)
    const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)
    
    if(componentName == null && frontMatterAndMarkdown.componentNameFromFrontMatter == null) {
        throw new Error('You must provide a component name eithe through front matter or as a parameter')
    }

    const reactComponentString = createJsxComponentString(componentName ?? frontMatterAndMarkdown.componentNameFromFrontMatter as string, jsxString, frontMatterMode, frontMatterAndMarkdown.frontMatterJsxString, frontMatterAndMarkdown.frontMatterObject, reactContextName)

    return reactComponentString
}

/**
 * Converts Markdown to JSX, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string} `markdownString` Markdown string to convert to a react component that may also include front-matter and html.
 * @param {componentName} `componentName` Name of new react component.
 * @param {string} `reactContextVarName` name of react context variable name to assign front-matter variables to. like [shuji, setShuji] = useContext(...)
 * @param {string} `reactContextName` name of react context object to assign front-matter variables to.
 * @return {Promise[string, object]} Markdown JSX string and front matter object.
 */
export const convertMarkdownToJSXAndObject = async (markdownString: string, reactContextVarName: string, reactContextName: string, componentName?: string): Promise<[string, object]> => {
    const frontMatterAndMarkdown = extractFrontMatter(markdownString, frontMatterModeEnum.object, reactContextVarName, reactContextName)
    const jsxString = convertMarkdownAndHtmlToJsx(frontMatterAndMarkdown.markdownString)

    if(componentName == null && frontMatterAndMarkdown.componentNameFromFrontMatter == null) {
        throw new Error('You must provide a component name eithe through front matter or as a parameter')
    }

    const reactComponentString = createJsxComponentString(componentName ?? frontMatterAndMarkdown.componentNameFromFrontMatter as string, jsxString, frontMatterModeEnum.object, undefined, frontMatterAndMarkdown.frontMatterObject, reactContextName)

    return [reactComponentString, frontMatterAndMarkdown.frontMatterObject]
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

const extractFrontMatter = (stringWithFrontMatter: string, frontMatterMode: frontMatterModeEnum, reactContextVarName?: string, reactContextName?: string): FrontMatterSplitFromMarkdown => {
    try {
        const { data, content } = matter(stringWithFrontMatter)

        const frontMatterObject : any = frontMatterMode == frontMatterModeEnum.object 
            ? data
            : undefined 

        const frontMatterJsxString = frontMatterMode == frontMatterModeEnum.reactHead || frontMatterMode == frontMatterModeEnum.reactHelmet
            ? createFrontMatterJSXString(data, frontMatterMode, reactContextVarName, reactContextName)
            : undefined

        const componentNameFromFrontMatter = data['react-component-name'] ?? 'shujiComponent'

        return {
            frontMatterJsxString: frontMatterJsxString,
            frontMatterObject: frontMatterObject,
            markdownString: content,
            componentNameFromFrontMatter
        }
    } catch (error) {
        logger().error(`failed to extract front matter: ${error}`)
        throw new error()
    }
}

const createFrontMatterJSXString = (propsToAssign: Object, frontMatterMode: frontMatterModeEnum, reactContextVarName?: string, reactContextName?: string): string => {
    if(Object.keys(propsToAssign).length < 1)
        return ''

    if(frontMatterMode == frontMatterModeEnum.reactHead) {
        return createReactHeadString(propsToAssign, reactContextVarName as string, reactContextName as string)
    }

    if(frontMatterMode == frontMatterModeEnum.reactHelmet) {
        return createReactHelmentElements(propsToAssign)
    }

    return ''

}

const createJsxComponentString = (componentName: string, reactString: string, frontMatterMode:frontMatterModeEnum, frontmatterString?: string, frontMatterObject?: object, reactContextName?: string): string => {
    const capitalizedMethodName = componentName.replace(/^\w/, c => c.toUpperCase())
    const camelCasedComponentName = componentName.replace(/^\w/, c => c.toLowerCase())

    let reactComponent = `${frontmatterString ? frontMatterMode == frontMatterModeEnum.reactHelmet ? `import { Helmet } from 'react-helmet'\n\n` : `import { useContext } from 'react'\nimport { ${reactContextName} } from 'reactHead'\n\n` : ''}`
    + `const ${capitalizedMethodName} = () => { \n  ${frontMatterMode == frontMatterModeEnum.reactHead ? `${frontmatterString}\n` : ''}
    return (
        <div className='${camelCasedComponentName}'>
        ${frontmatterString && frontMatterMode == frontMatterModeEnum.reactHelmet ? `${frontmatterString}\n\t\t` : ''}\t${reactString}
        </div>
    )\n}
    ${frontMatterObject ? `\nexport const frontMatter = ${JSON.stringify(frontMatterObject, null, " ")}\n` : ``}
    \nexport default ${capitalizedMethodName}`

     return reactComponent
 }


const createReactHelmentElements = (propsToAssign: Object) : string => {
    if(!propsToAssign) {
        return ''
    }

    //Example
    // <Helmet>
    //     <meta name="date" content="2021-01-01" />
    //     <title>node with react and redux</title>
    //     <meta name="slug" content="node-react-redux" />
    //     <meta name="description" content="How to node with react and redux" />
    //     <meta name="tags" content="node,react,redux" />
    // </Helmet>

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
            case 'react-component-name':
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

    const contextVarNameLettersOnly = reactContextVarName.replace(/[^\w]/g, '')
    const setContextVarName = 'set' + contextVarNameLettersOnly.replace(/^\w/, c => c.toUpperCase())
    const camelCasedVarName = contextVarNameLettersOnly.replace(/^\w/, c => c.toLowerCase())

    let propAssignmentString = ''

    for (const propName in propsToAssign) {
        const propValue = propsToAssign[propName as keyof Object]
        let propValueStringified = stringify(propValue)
        const propNameAlphanumericOnly = propName.replace(/[^\w]/g, '')

        if(propNameAlphanumericOnly.toLowerCase() === 'reactcomponentname')
            continue

        propAssignmentString += `\t\t${propNameAlphanumericOnly} = ${propValueStringified}, \n`
    }

    const contextAssignmentString =
    `\n\tconst [${camelCasedVarName}, ${setContextVarName}] = useContext(${reactContextName})`
    + `\n\n\t${setContextVarName}({`
        + `\n\t\t...${camelCasedVarName},`
        + `\n${propAssignmentString}`
    + `\t})`

    return contextAssignmentString
}


#! /usr/bin/env node

import yargs from 'yargs'
import { readFileSync } from 'fs'

import { version } from '../package.json'
import { transformMarkdownFiles, defaultOptions, Options } from './index'
import { logger, setLogLevel } from './logger'

const handleArgs = (cliArgs: string[]) : any => {
    const yargsObject = yargs(cliArgs)
        .scriptName('shuji')
        .wrap(yargs.terminalWidth())
        //Show help
        .help('help')
        .alias('help', 'h')
        .showHelpOnFail(false, 'whoops, something went wrong! try running with --help')
        .epilogue('for more information, check out the documentation at https://github.com/ermish/shuji')
        //Show version option
        .version('v', 'shuji version', version ?? 'unable to verify. check your package.json')
        .alias('version', 'v')
        //Allow reading options from a file
        .config('config', 'path to a Shuji ".shujirc.json" or ".shujirc" config file ', function (configPath: string) {
            return JSON.parse(readFileSync(configPath, 'utf-8'))
        })
        .alias('c', 'config')
        .example([
            ['$0 -c="./.shujirc"', 'importing config file.'],
            ['$0 --inputPath=./src/markdown/ --outputPath=./src/jsxPages/ --config=./.shujirc.json', 'Full example']
        ])
        //Debug Mode
        .option('logLevel', {
            alias: 'l',
            choices: [1,2,3],
            describe: 'Set the log level. 1=debug mode, 2=default, 3= no logs',
            default: 2,
            type: 'number',
        })
        //Shuji Options
        .group(['inputPath', 'outputPath', 'frontMatterMode', 'reactHeadContextName', 'reactHeadContextVarName', 'deleteExistingOutputFolder'], 'Config Parameters:')
        .option('inputPath', {
            alias: 'i',
            describe: 'Target folder or file with .md files for Shuji to parse',
            type: 'string',
        })
        .option('outputPath', {
            alias: 'o',
            describe: 'Output destination folder to write the compiled .jsx files',
            type: 'string',
        })
        .option('frontMatterMode', {
            alias: 'fm',
            choices: ['reacthelmet','reacthead','none'],
            describe: 'Toggle output style of front matter. "reacthelmet" uses react helmet syntax. "reactHead" will creat a react context you have more control over. This is referred to as "reactHead"',
            type: 'string',
        })
        .option('reactHeadContextName', {
            alias: 'rc',
            describe: "The react context name in which any detected front-matter will be set through useContext('${reactContextName}')",
            type: 'string',
        })
        .option('reactHeadContextVarName', {
            alias: 'rcv',
            describe: "The name of the react context object and set method assigned from useContext('${reactContextName}'). ex. const [${yourVar}, set${YourVar}]",
            type: 'string',
        })
        .option('deleteExistingOutputFolder', {
            alias: 'del',
            describe: 'Delete existing content in the output folder (outputFolderPath) before writing compiled files',
            type: 'boolean',
        })
        .argv

    //Enable debugger logging ASAP
    setLogLevel(yargsObject['logLevel'] as number)

    logger().debug(`cli args: ${JSON.stringify(yargsObject)}`)

    return yargsObject
}

const convertYargsToShujiOptions = (yargs: any) : Options => {
    const mergedObject:any = {}

    Object.keys(defaultOptions).forEach(key => {
        if (yargs.hasOwnProperty(key)) {
            mergedObject[key] = yargs[key]
        }
    })

    logger().debug(`parsed user options: ${JSON.stringify(mergedObject)}`)

    return mergedObject
}


export const cli = async (args: string[]) => {
    try {

        const yargs = handleArgs(args)
        const userOptions = convertYargsToShujiOptions(yargs)

        await transformMarkdownFiles(userOptions)
    } catch (err) {
        logger().error(`An unknown error occurred! Try using a markdown validator to ensure your mardown files are valid`, err)
    }
}

cli(process.argv)

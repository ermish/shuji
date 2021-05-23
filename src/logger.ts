import chalk from 'chalk'

//TODO make this a real logger
export function logger() {
    const shujiPurple = chalk.hex('#6C63A2')

    const debug = (message:string) => {
         if(!isDebugMode)
             return

        const blue = chalk.hex('#58a6ff')
        console.log(shujiPurple('Shuji: ') + blue(message))
    }

    const info = (message:string) => {
        const blue = chalk.hex('#58a6ff')
        console.log(shujiPurple('Shuji: ') + blue(message))
    }

    const warn = (message:string) => {
        const orange = chalk.hex('#FFA500')
        console.log(shujiPurple('Shuji: ') + orange(message))
    }

    const error = (message:string, error?: Error) => {
        const red = chalk.hex('#ff7b72')
        const fullErrorMessage = error ? message + `\n actual error: ${error.message} \n ${error.stack}` : message
        console.log(shujiPurple('Shuji: ') + red(fullErrorMessage))
    }

    return {
        debug,
        info,
        warn,
        error
    }
}

let isDebugMode = false
export function setIsDebugMode(enable:boolean) {
    isDebugMode = enable === true
}

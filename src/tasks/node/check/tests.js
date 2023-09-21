import { URL } from 'url'

import * as fs from 'fs'
import * as path from 'path'

import * as cmd from '../../../libraries/node/cmd.js'
import * as host from '../../../libraries/node/host.js'
import * as log from '../../../libraries/node/log.js'

const __filename = new URL('', import.meta.url).pathname

const main = async (scriptFilePath) => {
    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking tests...')

    const testsDirectoryPath = host.getRelativeToRootPath('./src/tests/node/')

    const allRelativeTestFilePaths = await fs.promises.readdir(
        testsDirectoryPath,
        {
            recursive: true,
        }
    )
    const allTestFilePaths = allRelativeTestFilePaths.map(
        (relativeTestFilePath) =>
            path.join(testsDirectoryPath, relativeTestFilePath)
    )

    const commandName = 'node'
    const commandArgv = ['--test', ...allTestFilePaths]

    let commandExitCode, commandStdOut, commandStdErr, commandError

    try {
        const { exitCode, stdout, stderr } = await cmd.runWithProgress(
            commandName,
            commandArgv,
            (stdout) => {
                log.info(stdout)
            },
            (stderr) => {
                // BUG: command outputs normal messages on stderr
                log.info(stderr)
            }
        )

        commandExitCode = exitCode
        commandStdOut = stdout
        commandStdErr = stderr
    } catch (e) {
        commandError = e
    }

    const logFileName = 'node-test.log'
    const logFilePath = host.getTaskOutputFilePath(
        scriptFilePath,
        `./${logFileName}`
    )

    await host.writeFile(
        logFilePath,
        cmd.getStdOutAndOrStdErr(commandStdOut, commandStdErr)
    )

    cmd.expectStdOut(
        commandError,
        commandExitCode,
        commandStdOut,
        commandStdErr
    )

    log.info('Successfully checked tests.')
}

;(async () => {
    await main(__filename)
})()

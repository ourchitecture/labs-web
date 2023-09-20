const cmd = require('../../../libraries/node/cmd')
const host = require('../../../libraries/node/host')
const log = require('../../../libraries/node/log')

const main = async (scriptFilePath) => {
    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking formatting...')

    const commandName = 'pnpm'
    const commandArgv = [
        'prettier',
        '--check',
        '--config',
        host.getRelativeToRootPath('./.prettierrc.yaml'),
        '--ignore-path',
        host.getRelativeToRootPath('./.gitignore'),
        '--ignore-path',
        host.getRelativeToRootPath('./.prettierignore'),
        host.getRelativeToRootPath('./'),
    ]

    let prettierExitCode, prettierStdOut, prettierStdErr, prettierError

    try {
        const { exitCode, stdout, stderr } = await cmd.runWithProgress(
            commandName,
            commandArgv,
            (stdout) => {
                log.info(stdout)
            },
            (stderr) => {
                log.error(stderr)
            }
        )

        prettierExitCode = exitCode
        prettierStdOut = stdout
        prettierStdErr = stderr
    } catch (e) {
        prettierError = e
    }

    const logFileName = 'prettier.log'
    const logFilePath = host.getTaskOutputFilePath(
        scriptFilePath,
        `./${logFileName}`
    )

    await host.writeFile(
        logFilePath,
        cmd.getStdOutAndOrStdErr(prettierStdOut, prettierStdErr)
    )

    cmd.expectStdOut(
        prettierError,
        prettierExitCode,
        prettierStdOut,
        prettierStdErr
    )

    log.info('Successfully checked formatting.')
}

;(async () => {
    await main(__filename)
})()

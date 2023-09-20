const cmd = require('../../../libraries/node/cmd')
const host = require('../../../libraries/node/host')
const log = require('../../../libraries/node/log')

const executePnpmCommand = async (
    scriptFilePath,
    commandLogFileName,
    commandArgv
) => {
    const commandName = 'pnpm'
    let commandExitCode, commandStdOut, commandStdErr, commandError

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

        commandExitCode = exitCode
        commandStdOut = stdout
        commandStdErr = stderr
    } catch (e) {
        commandError = e
    }

    const logFilePath = host.getTaskOutputFilePath(
        scriptFilePath,
        `./${commandLogFileName}`
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
}

const checkFormattingWithPrettier = async (scriptFilePath) => {
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

    return await executePnpmCommand(scriptFilePath, 'prettier.log', commandArgv)
}

const checkFormattingWithMarkdownlint = async (scriptFilePath) => {
    const commandArgv = [
        'markdownlint-cli2',
        '**/*.md',
        '#node_modules',
        '--config',
        host.getRelativeToRootPath('./.markdownlint-cli2.yaml'),
    ]

    return await executePnpmCommand(
        scriptFilePath,
        'markdownlint.log',
        commandArgv
    )
}

const main = async (scriptFilePath) => {
    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking formatting...')

    await checkFormattingWithPrettier(scriptFilePath)

    await checkFormattingWithMarkdownlint(scriptFilePath)

    log.info('Successfully checked formatting.')
}

;(async () => {
    await main(__filename)
})()

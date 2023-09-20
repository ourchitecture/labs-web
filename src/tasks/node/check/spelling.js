const cmd = require('../../../libraries/node/cmd')
const host = require('../../../libraries/node/host')
const log = require('../../../libraries/node/log')

const main = async (scriptFilePath) => {
    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking spelling...')

    const spellingCacheFilePath = host.getTaskOutputFilePath(
        __filename,
        './.cspellcache'
    )

    const commandName = 'pnpm'
    const commandArgv = [
        'cspell',
        host.getRelativeToRootPath('./'),
        '--gitignore',
        '--no-progress',
        '--config',
        host.getRelativeToRootPath('./cspell.config.yaml'),
        '--locale',
        'en',
        '--cache',
        '--cache-location',
        spellingCacheFilePath,
    ]

    let cspellExitCode, cspellStdOut, cspellStdErr, cspellError

    try {
        const { exitCode, stdout, stderr } = await cmd.runWithProgress(
            commandName,
            commandArgv,
            (stdout) => {
                log.info(stdout)
            },
            (stderr) => {
                // BUG: CSpell outputs normal messages on stderr
                log.info(stderr)
            }
        )

        cspellExitCode = exitCode
        cspellStdOut = stdout
        cspellStdErr = stderr
    } catch (e) {
        cspellError = e
    }

    const logFileName = 'cspell.log'
    const logFilePath = host.getTaskOutputFilePath(
        scriptFilePath,
        `./${logFileName}`
    )

    await host.writeFile(
        logFilePath,
        cmd.getStdOutAndOrStdErr(cspellStdOut, cspellStdErr)
    )

    cmd.expectStdOut(cspellError, cspellExitCode, cspellStdOut, cspellStdErr)

    log.info('Successfully checked spelling.')
}

;(async () => {
    await main(__filename)
})()

import { URL } from 'url'

import * as cmd from '../../../libraries/node/cmd.js'
import * as env from '../../../libraries/node/env.js'
import * as host from '../../../libraries/node/host.js'
import * as log from '../../../libraries/node/log.js'

const __filename = new URL('', import.meta.url).pathname

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
        ...(env.isDebugMode()
            ? ['--show-context', '--show-suggestions']
            : ['--no-progress']),
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

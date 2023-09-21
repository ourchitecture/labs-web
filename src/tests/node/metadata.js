import assert from 'node:assert'
import { describe, it } from 'node:test'

import * as fs from 'fs'
import { glob } from 'glob'

import * as host from '../../libraries/node/host.js'

describe('metadata tests', async () => {
    it('package.json licensing', async () => {
        const allNodePackageFilePaths = await glob('**/package.json')

        for (const allNodePackageFilePath of allNodePackageFilePaths) {
            const packageData = await host.readJson(allNodePackageFilePath)

            assert.strictEqual(packageData.license, 'MIT OR CC0-1.0')
        }

        assert.ok(true, 'All licenses pass')
    })
})

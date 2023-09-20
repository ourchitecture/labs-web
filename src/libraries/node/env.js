const hasKey = (key) => {
    return key in process.env
}

const assertRequired = (key) => {
    if (!hasKey(key)) {
        throw new Error(`Missing required environment variable "${key}"`)
    }
}

const get = (key) => {
    return process.env[key]
}

const getAsBoolean = (key) => {
    if (hasKey(key) && process.env[key]) {
        return JSON.parse(process.env[key]) ? true : false
    }

    return false
}

const getRequired = (key) => {
    assertRequired(key)
    return process.env[key]
}

const isContinuousIntegrationMode = () => {
    return getAsBoolean('CI') === true
}

const isDebugMode = () => {
    return getAsBoolean('DEBUG') === true
}

const isProductionMode = () => {
    return get('NODE_ENV') === 'production'
}

const isNonProductionMode = () => {
    return !isProductionMode()
}

module.exports = {
    assertRequired,
    get,
    getAsBoolean,
    getRequired,
    hasKey,
    isContinuousIntegrationMode,
    isDebugMode,
    isNonProductionMode,
    isProductionMode,
}

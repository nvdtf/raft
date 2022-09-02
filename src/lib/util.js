export function prettifyError(error) {
    if (error.search('HTTP Request Error')) {
        const fieldName = 'responseBody='
        const fieldPos = error.indexOf(fieldName)
        const endPos = error.indexOf('\n', fieldPos)
        const result = error.slice(fieldPos + fieldName.length, endPos)
        const resultJson = JSON.parse(result)
        if (resultJson && resultJson.message)
            return resultJson.message
    }

    return error
}
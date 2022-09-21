export function doesNotExist(field: string): boolean {
    if (field === undefined || field === null || field === '')
        return true
    return false
}

export function isString(field: any): boolean {
    if (typeof field === 'string' || field instanceof String)
        return true
    return false
}
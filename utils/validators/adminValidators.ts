export function validateCardValue(value: number){
    if (!value || value <= 0)
        throw new Error('Value was not inserted!')
    
    return true
}

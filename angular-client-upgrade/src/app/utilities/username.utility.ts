export function exists(username: string): string {
    return username == undefined || username == null || username == '' ? random(8) : username;
}

export function generateToken(username: string): string {
    return `${exists(username)}-${random(16)}`;
}

function random(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;  
}
export const generateToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
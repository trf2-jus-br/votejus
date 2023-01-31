import * as jose from 'jose'

export default {
    secret: new TextEncoder().encode(process.env.JWT_SECRET),

    alg: 'HS256',

    async buildJwt(payload) {
        const jwt = new jose.SignJWT(payload)
            .setProtectedHeader({ alg: this.alg })
            .setIssuedAt()
            .setIssuer(process.env.API_URL_BROWSER)

        if (process.env.JWT_EXPIRATION_TIME)
            jwt.setExpirationTime(process.env.JWT_EXPIRATION_TIME)

        return await jwt.sign(this.secret)
    },

    async parseJwt(jwt) {
        const { payload, protectedHeader } = await jose.jwtVerify(jwt, this.secret, {
            issuer: process.env.API_URL_BROWSER,
        })

        return payload
    }
}
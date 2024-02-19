export default {
    electionName(s, context) {
        return this.name(s, context, 'eleição')
    },

    voterName(s, context) {
        return this.name(s, context, 'eleitor')
    },

    candidateName(s, context) {
        return this.name(s, context, 'candidato')
    },

    name(s, context, name) {
        if (!s) throw `Nome de ${name} não informado` + (context ? ' ' + context : '')
        s = s.trim()
        if (!s) throw `Nome de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    emailRegex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

    voterEmail(s, context) {
        return this.email(s, context, 'eleitor')
    },

    administratorEmail(s, context) {
        const email = this.email(s, context, 'administrador')
        const adminEmailRegex = process.env.ADMIN_EMAIL_REGEX
        if (adminEmailRegex) {
            const regex = new RegExp(adminEmailRegex, '')
            if (!regex.test(email)) throw `E-mail de administrador não permitido`
        }
        return email
    },
    ehMatriculaSIGA(s){
        const u = s?.toUpperCase();
        return u?.startsWith("T2") || u?.startsWith("RJ") || u?.startsWith("ES") || u?.startsWith('JRJ');
    },
    matriculaSIGA(s, context) {
        if (!s) 
            throw `Matrícula não informada ${context || ''}`;
        return s
    },

    email(s, context, name) {
        if (!s) throw `E-mail de ${name} não informado` + (context ? ' ' + context : '')
        s = s.trim().toLowerCase()
        if (!this.validateEmail(s)) throw `E-mail de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    validateEmail(email) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }
}
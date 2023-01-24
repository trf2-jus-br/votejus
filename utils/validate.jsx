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
        s = s.trim()
        if (!s) throw `Nome de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    emailRegex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

    voterEmail(s, context) {
        return this.email(s, context, 'eleitor')
    },

    administratorEmail(s, context) {
        return this.email(s, context, 'administrador')
    },

    email(s, context, name) {
        s = s.trim()
        if (!this.validateEmail(s)) throw `E-mail de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    validateEmail(email) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }
}
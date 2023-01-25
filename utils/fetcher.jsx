export default {
    fetcher: (...args) => fetch(...args).then(res => res.json()),

    async post(url, body, params) {
        let errorMsg = undefined
        try {
            const res = await fetch(`${url}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json()
            if (res.status !== 200) {
                if (data && data.error && data.error.err && typeof data.error.err === 'object' && data.error.err !== null && data.error.err.message) errorMsg = data.error.err.message
                else if (data && data.error && data.error.err && typeof data.error.err === 'string' && data.error.err) errorMsg = data.error.err
                else if (data && data.error && data.error.message) errorMsg = data.error.message
                else errorMsg = "Indisponibilidade de sistema."
            }
            return data
        } catch (ex) {
            errorMsg = "Ocorreu uma indisponibilidade."
        }
        finally {
            if (errorMsg) {
                if (params && params.setErrorMessage) params.setErrorMessage(errorMsg)
                throw errorMsg
            }
        }
    }

}
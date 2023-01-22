export default {
    fetcher: (...args) => fetch(...args).then(res => res.json()),

    async post(url, body, params) {
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
            if (res.status === 500) {
                if (params && params.setErrorMessage) {
                    if (data && data.error && data.error.err) {
                        params.setErrorMessage(data.error.err)
                    }
                    else params.setErrorMessage("Indisponibilidade de sistema.")
                }
            }
            return data
        } catch (ex) {
            if (params && params.setErrorMessage) params.setErrorMessage("Ocorreu uma indisponibilidade.")
        }
    }

}
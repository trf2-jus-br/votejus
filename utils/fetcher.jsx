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
            console.log("oi")
            const data = await res.json()
            console.log("oi")
            if (res.status === 500) {
                console.log("oi3")
                if (params && params.setErrorMessage) {
                    console.log("oi33")
                    if (data && data.error && data.error.err) {
                        console.log("oi34")
                        params.setErrorMessage(data.error.err)
                    }
                    else params.setErrorMessage("Indisponibilidade de sistema.")
                }
            }
            return data
        } catch (ex) {
            console.log("oi4")
            console.log(ex)
            if (params && params.setErrorMessage) params.setErrorMessage("teste")
        }
    }

}
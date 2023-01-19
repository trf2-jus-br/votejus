export default {
    fetcher: (...args) => fetch(...args).then(res => res.json()),

    async post(url, body, params) {
        const res = await fetch(`${url}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json()
        return data
    }

}
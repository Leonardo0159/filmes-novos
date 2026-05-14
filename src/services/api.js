export const get = async (url) => {
    let token = process.env.NEXT_PUBLIC_TMDB_API_KEY

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+token+'',
            'accept': 'application/json'
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (err) {
        return null;
    }
};

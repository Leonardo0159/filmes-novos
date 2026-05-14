export const get = async <T>(url: string): Promise<T | null> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY as string;

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        return null;
    }
};

import { StorageWithExpiry } from "./StorageWithExpiry";


export async function GlobalFetch(url: string | URL | Request, originalRequest: RequestInit | undefined = undefined) {
    const token = StorageWithExpiry.get<string>('token');
    if (originalRequest) {
        if (token) {

            (originalRequest.headers as Record<string, string>)["Authorization"] = token;
        }
        return await fetch(url, originalRequest);
    }
    else {
        return await
            await fetch(url, {
                headers: {
                    Authorization: token ?? ''
                }

            })
    }
};
import { imageUrl } from "./config"
import { TOKEN_KEY } from "./store/auth"


export const fetchPosts = async (route, offset=0) => {
    try {

        const res = await fetch(`${imageUrl}/api${route}?offet=${offset}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        })

        if (res.status < 400) {
            const posts = await res.json()
            return posts
        }
    } catch(e) {
        console.log(e)
        return []
    }

    
}
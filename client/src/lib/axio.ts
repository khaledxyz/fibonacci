import axios from 'axios'
import { toast } from 'sonner'

const options = {}

const Axios = axios.create(options)

Axios.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status >= 500 && err.response.status < 600)
            return toast.error('Something went wrong, Please try again later.')
        if (err.response && err.response.status === 429) return toast.error('Too many requests, Please try again later.')

        if (err.response && err.response.status === 403) {
            alert('Votre session a expiré, veuillez vous reconnecter.')

            return (window.location.href = '/login')
        }

        return Promise.reject(err)
    }
)

export default Axios

import axios from '@/api/axios'

const useRefreshToken = () => {
  const refresh = async () => {
    return await axios.get('/admin/auth/refresh', { withCredentials: true })
  }

  return refresh
}

export default useRefreshToken

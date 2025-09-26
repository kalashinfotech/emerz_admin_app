import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'

import type { SessionInfo, SignInRq, SignInRs, TError } from '@/types'
import type { FetchMenuRsDto } from '@/types/parameters/menu'

import axios from '@/api/axios'

import axiosPrivate from '@/hooks/use-axios-private'

import { useMenuStore } from '@/stores/menu-store'

type SignOutResponse = {
  status?: number
}

export type AuthContextValue = {
  signIn: ({ emailId, password, rememberMe }: SignInRq) => Promise<SignInRs>
  signOut: () => Promise<SignOutResponse>
  sessionInfo: SessionInfo | null
  setSessionInfo: (user: SessionInfo | null) => void
  authInitialized: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthenticationProvider(props: { children: ReactNode }) {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [authInitialized, setAuthInitialized] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const fetchProfile = async () => {
    if (!sessionInfo) {
      await axiosPrivate
        .get<SessionInfo, AxiosResponse<SessionInfo, TError>>('/user-accounts/me', {
          withCredentials: true,
        })
        .then((user) => {
          setSessionInfo(user.data)
        })
        .catch((error) => {
          console.error('Error in fetching user profile', error)
        })
        .finally(() => setAuthInitialized(true))
    }
  }

  const fetchMenu = async () => {
    await axiosPrivate
      .get<SessionInfo, AxiosResponse<FetchMenuRsDto, TError>>('/user-accounts/me/menu', { withCredentials: true })
      .then((response) => {
        useMenuStore.getState().setMenu(response.data.menu)
      })
      .catch((error) => {
        console.error('Error in fetching user profile', error)
      })
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchProfile()
    }
    fetch()
  }, [])

  const logout = async (): Promise<SignOutResponse> => {
    try {
      await axios.get<null, AxiosResponse<null, TError>>(`${import.meta.env.VITE_BACKEND_URL}/admin/auth/logout`, {
        withCredentials: true,
      })
      queryClient.invalidateQueries()
      return { status: 0 }
    } catch (error) {
      console.error('Error in logging out', error)
      return { status: -1 }
    } finally {
      setSessionInfo(null)
    }
  }

  const signIn = async ({ emailId, password, rememberMe }: SignInRq): Promise<SignInRs> => {
    const config = { withCredentials: true }
    try {
      const user = await axios.post<null, AxiosResponse<null, TError>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/auth`,
        { emailId, password, rememberMe },
        config,
      )
      await fetchProfile()
      await fetchMenu()
      return { status: user.status, error: undefined }
    } catch (error) {
      setSessionInfo(null)
      if (isAxiosError(error)) {
        if (error.response) {
          const err = error as AxiosError<TError>
          return { status: -1, error: err.response?.data.error.message }
        } else if (error.request) {
          return {
            status: -1,
            error: `An unexpected error (${error.code}) ocurred. Please try after sometime.`,
          }
        }
      }
      return {
        status: -1,
        error: `Something went terribly wrong (${JSON.stringify(error)}). Please contact support.`,
      }
    }
  }
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: logout,
        sessionInfo,
        setSessionInfo,
        authInitialized,
      }}>
      {authInitialized ? props.children : null}
    </AuthContext.Provider>
  )
}

export default AuthContext

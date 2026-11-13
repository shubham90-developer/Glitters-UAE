'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useNotificationContext } from '@/context/useNotificationContext'
import { useLoginMutation } from '@/store/apiSlice'
import { setCredentials } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const loginFormSchema = yup.object({
  email: yup.string().email('Please enter valid email').required('Email is required'),

  password: yup.string().required('Password is required'),
})

type LoginFormFields = yup.InferType<typeof loginFormSchema>

const useSignIn = () => {
  const [loginUser, { isLoading }] = useLoginMutation()

  const dispatch = useAppDispatch()

  const router = useRouter()

  const { showNotification } = useNotificationContext()

  const { control, handleSubmit } = useForm<LoginFormFields>({
    resolver: yupResolver(loginFormSchema),

    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin123',
    },
  })

  const login = handleSubmit(async (values: LoginFormFields) => {
    try {
      const result = await loginUser(values).unwrap()

      console.log('LOGIN RESULT', result)

      // save token
      localStorage.setItem('token', result.token)

      dispatch(
        setCredentials({
          token: result.token,
          user: result.data,
        }),
      )

      showNotification({
        message: result.message || 'Login successful',
        variant: 'success',
      })

      // redirect
      router.push('/dashboard')

      // OR
      // window.location.href = '/dashboard'
    } catch (error: any) {
      console.log('LOGIN ERROR', error)

      showNotification({
        message: error?.data?.message || 'Login failed',
        variant: 'danger',
      })
    }
  })

  return {
    loading: isLoading,
    login,
    control,
  }
}

export default useSignIn

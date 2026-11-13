import { Metadata } from 'next'
import SignIn from './components/SignIn'

export const metadata: Metadata = { title: 'Sign In' }

const page = () => {
  return <SignIn />
}

export default page

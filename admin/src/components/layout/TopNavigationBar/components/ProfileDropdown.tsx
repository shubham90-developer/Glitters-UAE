'use client'

import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/store/authSlice'
import { useGetSettingsQuery } from '@/store/settingApi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const ProfileDropdown = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // getSettings already returns ISetting[] (unwrapped in transformResponse)
  const { data: settingsData } = useGetSettingsQuery()

  const favicon = typeof settingsData?.[0]?.favicon === 'string' ? settingsData[0].favicon : null

  const profileImage = favicon || avatar1

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logout()) // clears token from state, localStorage and cookie
    router.replace('/auth/sign-in')
  }

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as="a"
        href="#"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image
            className="rounded-circle"
            width={32}
            height={32}
            src={profileImage}
            alt="Profile"
            style={{
              objectFit: 'cover',
            }}
          />
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as="h6" className="dropdown-header">
          Welcome To Ecomm Admin!
        </DropdownHeader>

        <div className="dropdown-divider my-1" />

        <DropdownItem as="a" href="#" className="text-danger" onClick={handleLogout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown

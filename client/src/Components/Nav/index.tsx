import lightLogo from '../../assets/logos/ligthLogo.png'
import darkLogo from '../../assets/logos/darkLogo.png'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../hooks'

import { UserAvatar } from './UserAvatar'
import Cart from './Cart'

interface INavProps {
  dark?: boolean
  textColor?: string
  bgColor?: string
}

const Nav: React.FC<INavProps> = ({
  dark = false,
  textColor = '#fff',
  bgColor = 'transparent',
}) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [isUserOptionOpen, setIsUserOptionOpen] = useState<boolean>(false)

  const { data } = useAppSelector((state) => state.userState)
  return (
    <div className={`w-[100%] bg-[${bgColor}]`}>
      <header
        className={`flex justify-between mx-auto py-2 px-10 items-center relative w-[100%] max-w-[1200px] text-[${
          dark ? '#242424' : textColor
        }] `}
      >
        {/* Logo */}

        <NavLink to={'/'}>
          <h1 className="LogoName z-[50] w-[36px] md:w-[52px] cursor-pointer relative">
            {!dark ? (
              <img src={lightLogo} alt="light_logo" width={'100%'} />
            ) : (
              <img src={darkLogo} alt="dark_logo" width={'100%'} />
            )}
          </h1>
        </NavLink>

        {/* desktop nav  links */}

        {!data?.userName ? (
          <div className="md:flex justify-between items-center  hidden">
            <NavLink to={'/cloudkitchen'}>
              <button className="mr-5 text-xl">Add cloud kitchen</button>
            </NavLink>
            <NavLink to={'/login'}>
              <button className="mr-5 text-xl">Log in</button>
            </NavLink>
            <NavLink to={'/signup'}>
              <button className="text-xl">Sign up</button>
            </NavLink>
          </div>
        ) : (
          <>
            <div className="md:flex justify-between items-center gap-6 hidden">
              <Cart />
              <UserAvatar userName={data?.userName} size={28} />
            </div>
          </>
        )}

        {/* Hamburger */}

        <div
          className="flex flex-col justify-between w-[24px] h-[18px] overflow-hidden md:hidden z-20 relative"
          onClick={() => {
            setIsNavOpen((prev) => (prev = !prev))
          }}
        >
          <div
            className={`w-[100%] h-[2px] my-0.5 absolute ${
              dark ? 'bg-black' : 'bg-white'
            } duration-500 ease-in-out transition-all ${
              isNavOpen ? 'top-1.5 rotate-[135deg]' : 'rotate-0'
            }`}
          ></div>
          <div
            className={`w-[100%] h-[2px] my-0.5 absolute top-1.5 ${
              dark ? 'bg-black' : 'bg-white'
            } duration-700  ease-in-out transition-all ${
              isNavOpen ? 'left-[-60px]' : 'left-0'
            }`}
          ></div>
          <div
            className={`w-[100%] h-[2px] my-0.5 absolute  ${
              dark ? 'bg-black' : 'bg-white'
            } duration-500 ease-in-out transition-all ${
              isNavOpen ? 'top-1.5 -rotate-[135deg]' : 'rotate-0 top-3'
            }`}
          ></div>
        </div>

        {/* Moblie nav links*/}

        <div
          className={`absolute   w-[100%] rounded-b-lg glassmorphism ${
            dark ? 'bg-[#fff]' : ''
          } left-0 md:hidden transition-all duration-700 ease-in-out ${
            isNavOpen ? 'top-0' : '-top-[500%]'
          }`}
        >
          <div
            className={`flex flex-col justify-between items-center text-[${
              dark ? '000' : '#fff'
            }]] mt-[3rem] py-3`}
          >
            <NavLink to={'/cloudkitchen'}>
              <button
                className="py-2.5 text-xl"
                onClick={() => {
                  setIsNavOpen((prev) => (prev = !prev))
                }}
              >
                Add cloud kitchen
              </button>
            </NavLink>
            <NavLink to={'/login'}>
              <button
                className="py-2.5 text-xl"
                onClick={() => {
                  setIsNavOpen((prev) => (prev = !prev))
                }}
              >
                Log in
              </button>
            </NavLink>
            <NavLink to={'/signup'}>
              <button
                className="py-2.5 text-xl"
                onClick={() => {
                  setIsNavOpen((prev) => (prev = !prev))
                }}
              >
                Sign up
              </button>
            </NavLink>
          </div>
        </div>
      </header>
    </div>
  )
}
export default Nav
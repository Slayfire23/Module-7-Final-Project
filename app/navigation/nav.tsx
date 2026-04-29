import Link from 'next/link'
import '../navigation/nav.css'
import Logo from '../assets/logo.png'

const Nav = () => {
  return (
    <div id="nav">
        <div className="nav__container">
            <img src={Logo.src} alt="logo" className="logo" />
            <ul className="nav__links">
                    <li><Link href="/" className="nav__link">Home</Link></li>
                    <li><Link href="/find-anime" className="nav__link">Find Anime</Link></li>
                    <li><a href="#contact" className="nav__link">Contact</a></li>
                </ul>
        </div>
    </div>
  )
}

export default Nav

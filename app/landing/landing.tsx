import './landing.css'
import Skyline from '../assets/skyline.png'


const Landing = () => {
  return (
    <div id='landing-page'>
        <header>
    <div className="header__content">
        <h1 className="header__title">Discover Your Next Favorite Anime</h1>
        <p className="header__para">Find personalized anime recommendations</p>
        <div className="input__wrapper">
            <form action="/find-anime" method='get'>
                <input 
                type="text" 
                name='search'
                placeholder='Search by description, name, keyword'
                className='header__input'
                />
                <button className="btn click">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
        </div>
    </div>
    <div className="header__img-wrapper">
        <img src={Skyline.src} alt="skyline" className='header__img' />
    </div>
    </header>
    </div>
)}

export default Landing

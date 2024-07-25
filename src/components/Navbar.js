import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
  const navigate = useNavigate()
  const {state, dispatch} = useContext(UserContext)
  const renderList = () => {
    if(state){
      return [
        <li><Link to="/explore">Explore</Link></li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li>
          <button 
            className="btn waves-effect waves-light #64b5f6 blue lighten-2" 
            type="submit" 
            name="action" 
            onClick={() => {
              localStorage.clear()
              dispatch({type: "CLEAR"})
              navigate("/login")
            }}
          >
              Logout
          </button>
        </li>
      ]
    }else{
      return [
        <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  return (
    <div>
        <nav>
            <div className="nav-wrapper white">
            <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    </div>
  )
}

export default Navbar

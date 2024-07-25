import React, { useState, useContext } from 'react'
import Navbar from '../Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { UserContext } from '../../App'

const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
  
    const PostLogin = () => {
      fetch("http://localhost:5000/signin", {
          method: "post",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              email,
              password,
          })
      }).then(res => res.json())
      .then(data => {
          console.log(data)
          if(data.error){
              toast.error(data.error)
          }else{
              localStorage.setItem("jwt", data.token)
              localStorage.setItem("user", JSON.stringify(data.user))
              dispatch({type: "USER", payload: data.user})
              toast.success(data.message)
              navigate("/")
          }
      })
      .catch(err => {
          console.log(err)
      })
    }

  return (
    <div>
        <Navbar />
                <div className='card-container'>
                    <div className="card auth-card">
                        <h2>Instagram</h2>
                        <input
                        className='my-input'
                        type='text'
                        placeholder='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                        className='my-input'
                        type='password'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='login-btn'>
                            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2 " type="submit" name="action" onClick={() => PostLogin()}>
                                Login
                            </button>
                        </div>
                        <div className='signup-btn'>
                            <h6>
                                <Link to="/signup">Don't have an account?</Link>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default Login

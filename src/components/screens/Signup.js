import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [media, setMedia] = useState("")
  const [url, setUrl] = useState(undefined)
  
  useEffect(() => {
    if(url){
        uploadFields()
    }
  }, [url])

  const uploadProfilePic = () => {
    const data = new FormData()
    
    data.append("file", media)
    data.append("upload_preset", "instagram-clone")
    data.append("cloud_name", "dwfqxhw42")

    fetch("https://api.cloudinary.com/v1_1/dwfqxhw42/image/upload", {
        method: "post",
        body: data,
    })
    .then(res => res.json())
    .then(data => {
        setUrl(data.url)
    })
    .catch(err => {
        console.log(err)
    })
  }

  const uploadFields = () => {
    fetch("http://localhost:5000/signup", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            media: url,
        })
    }).then(res => res.json())
    .then(data => {
        if(data.error){
            toast.error(data.error)
        }else{
            toast.success(data.message)
            navigate("/login")
        }
    })
    .catch(err => {
        console.log(err)
    })
  }

  const PostSignup = () => {
    if(media){
        uploadProfilePic()
    }else{
        uploadFields()
    }
  }

  return (
    <div>
        <Navbar />
        <div className='card-container'>
            <div className="card auth-card" >
                <h2>Instagram</h2>
                <input
                type='text'
                placeholder='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <input
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Profile Picture</span>
                        <input type="file" onChange={(e) => setMedia(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload file" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostSignup()}>
                    Signup
                </button>
                <h5>
                    <Link to="/login">Already have an account?</Link>
                </h5>
            </div>
        </div>
    </div>
  )
}

export default Signup

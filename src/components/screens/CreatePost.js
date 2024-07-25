import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const [caption, setCaption] = useState("")
  const [media, setMedia] = useState("")
  const [url, setUrl] = useState("")
  useEffect(() => {
    if(url){
        fetch("http://localhost:5000/create-post", {
          method: "post",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer "+localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
              caption,
              media: url,
          })
      }).then(res => res.json())
      .then(data => {
          if(data.error){
              toast.error(data.error)
          }else{
              toast.success(data.message)
              navigate("/")
          }
      })
      .catch(err => {
          console.log(err)
      })
    }
  }, [url])

  function handleFileSelect(e) {
    const files = e.target.files

    setMedia(files[0])
    //for(let i=0; i< files.length; i++){
      //  setMedia(files[i])
    //}
  }

  const PostMedia = () => {
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

  return (
    <div>
        <Navbar />
        <div className='card input-field'
        style={{
            'margin': '30px auto',
            'maxWidth': '500px',
            'padding': '20px',
            'textAlign': 'center',
        }}>
            <input type='text' placeholder='caption' value={caption} onChange={(e) => setCaption(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Media</span>
                    <input type="file" multiple onChange={(e) => handleFileSelect(e)}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostMedia()}>
                Submit Post
            </button>
        </div>
    </div>
  )
}

export default CreatePost

import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Navbar';
import { UserContext } from '../../App';

const Profile = () => {
  const [userMedia, setUserMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const {state, dispatch} = useContext(UserContext)

  useEffect(() => {
    fetch("http://localhost:5000/view-user-posts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        setUserMedia(result.userpost);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ 'maxWidth': '900px', 'margin': '0px auto' }}>
        <div style={{
          'display': 'flex',
          'justifyContent': 'space-around',
          'margin': '18px 0px',
          'borderBottom': '1px solid grey'
        }}>
          <div>
            <img style={{ 'width': '160px', 'height': '160px', 'borderRadius': '80px', 'objectFit': 'cover' }}
              src={state ? state.media : "loading"}
              alt='pic'
            />
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'width': '108%' }}>
              <h6>{userMedia.length} posts</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"}  following</h6>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className='gallery' >
            {userMedia.map(item => (
              <img className='item' key={item._id} src={item.media} alt={item.caption} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

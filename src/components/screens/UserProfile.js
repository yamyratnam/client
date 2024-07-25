import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Navbar';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true)
  const [loading, setLoading] = useState(true);
  const {state, dispatch} = useContext(UserContext)
  const {userid} = useParams()
  console.log(userid)

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        setLoading(false);
        setUserProfile(result)
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Check if the current user is already following the viewed user
    if (state && state.following && userProfile && userProfile.user) {
      setShowFollow(!state.following.includes(userid));
    }
  }, [state, userProfile, userid]);

  const followUser = () =>{
      fetch(`http://localhost:5000/follow`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          followId: userid
        })
      }).then(res => res.json())
      .then(data => {
        console.log(data)
        dispatch({type: "UPDATE", payload: {following: data.following, followers: data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          }
        })
        setShowFollow(false)
      })
  }

  const unfollowUser = () =>{
    fetch(`http://localhost:5000/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      dispatch({type: "UPDATE", payload: {following: data.following, followers: data.followers}})
      localStorage.setItem("user", JSON.stringify(data))
      setUserProfile((prevState) => {
        const newFollower = prevState.user.followers.filter(item => item != data._id)
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollower
          }
        }
      })
    })
}

  return (
    <>
    {loading ? (
          <p>Loading...</p>
        ) : (
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
                        src={userProfile.user.media}
                        alt='pic'
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'width': '108%' }}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {showFollow ? 
                          <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => followUser()}>
                              Follow
                          </button>
                        :
                          <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => unfollowUser()}>
                              Unfollow
                          </button>
                        } 
                    </div>
                    </div>

                    {loading ? (
                    <p>Loading...</p>
                    ) : (
                    <div className='gallery' >
                        {userProfile.posts.map(item => (
                        <img className='item' key={item._id} src={item.media} alt={item.caption} />
                        ))}
                    </div>
                    )}
                </div>
            </div>
        )
    }
    </>
    
  );
}

export default UserProfile;

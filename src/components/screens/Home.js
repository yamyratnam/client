import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/view-following-posts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setData(result.posts);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const updateLikesInData = (postId, updatedLikes) => {
    const newData = data.map(item => {
      if (item._id === postId) {
        return { ...item, likes: updatedLikes };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  const likePost = (id) => {
    const userId = state._id;
    const updatedLikes = [...data.find(item => item._id === id).likes, userId];

    updateLikesInData(id, updatedLikes);

    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        // You can handle success if needed
      })
      .catch(err => {
        console.log(err);
        // Revert the UI update on error
        updateLikesInData(id, data.find(item => item._id === id).likes);
      });
  };

  const unlikePost = (id) => {
    const userId = state._id;
    const updatedLikes = data.find(item => item._id === id).likes.filter(likeId => likeId !== userId);

    updateLikesInData(id, updatedLikes);

    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
        updateLikesInData(id, data.find(item => item._id === id).likes);
      });
  };

  const makeComment = (text, postId) => {
    const userId = state._id;
    const newComment = { text, postedBy: { _id: userId, name: state.name } };

    const updatedData = data.map(item => {
      if (item._id === postId) {
        return { ...item, comments: [...item.comments, newComment] };
      } else {
        return item;
      }
    });

    setData(updatedData);

    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        // You can handle success if needed
      })
      .catch(err => {
        console.log(err);
        // Revert the UI update on error
        const revertedData = data.map(item => {
          if (item._id === postId) {
            return { ...item, comments: item.comments.slice(0, -1) };
          } else {
            return item;
          }
        });
        setData(revertedData);
      });
  };

  const deletePost = (postId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
  
    if (!isConfirmed) {
      return;
    }
  
    fetch(`http://localhost:5000/delete-post/${postId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setData(prevData => prevData.filter(item => item._id !== postId));
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  const deletePostComment = (postId, commentId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
  
    if (!isConfirmed) {
      return;
    }
  
    fetch(`http://localhost:5000/delete-comment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        // Remove the deleted comment from the state
        setData(prevData => {
          const updatedData = prevData.map(item => {
            if (item._id === postId) {
              // Remove the deleted comment from the comments array
              item.comments = item.comments.filter(comment => comment._id !== commentId);
            }
            return item;
          });
          return updatedData;
        });
      })
      .catch(error => {
        console.error('Error deleting comment on this post:', error);
      });
  };



  return (
    <div>
      <Navbar />
      <div className='home'>
        {Array.isArray(data) && data.length > 0 ? (
          data.map(item => (
            <div className='card home-card' key={item._id}>
              <h5>
                <Link to={item.postedBy._id !== state.id ? '/profile/' + item.postedBy._id : '/profile'}>{item.postedBy.name}</Link>
                {item.postedBy._id === state._id &&
                <i 
                  className="material-icons" 
                  style={{"float": "right"}} 
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
                }
              </h5>
              <div className='card-image'>
                <img src={item.media} alt='img' />
              </div>
              <div className='card-content'>
                {item.likes.includes(state._id)
                  ? <i className="material-icons" style={{ 'color': 'red' }} onClick={() => { unlikePost(item._id) }}>favorite</i>
                  : <i className="material-icons" onClick={() => { likePost(item._id) }}>favorite_border</i>
                }
                <h6>{item.likes.length} likes</h6>
                <h6>{item.caption}</h6>
                {
                    item.comments.map(record => (
                        <h6 key={record._id}>
                            <span style={{"fontWeight": "500"}}>{record.postedBy.name}</span> {record.text}
                            
                            {item.postedBy._id === state._id &&
                                <i 
                                    className="material-icons" 
                                    style={{"float": "right"}} 
                                    onClick={() => deletePostComment(item._id, record._id)} // Pass both postId and commentId
                                >
                                    delete
                                </i>
                            }
                        </h6>
                    ))
                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item._id)
                }}>
                  <input type='text' placeholder='add a comment' />
                </form>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;

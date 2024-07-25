import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import Home from "./components/screens/Home";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import {reducer, initialState} from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import Explore from "./components/screens/Explore";

export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: "USER", payload: user})
    }else{
      navigate('/login')
    }
  }, [])
  return (
    <>
      <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/explore" element={ <Explore/> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/signup" element={ <Signup/> } />
          <Route exact path="/profile" element={ <Profile/> } />
          <Route path="/create" element={ <CreatePost/> } />
          <Route path="/profile/:userid" element={ <UserProfile/> } />
        </Routes>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <UserContext.Provider value={{state, dispatch}}>
        <Toaster position="bottom-right" toastOptions={{duration: 2000}} />
        <Routing />
      </UserContext.Provider>
    </div>
    
  );
}

export default App;

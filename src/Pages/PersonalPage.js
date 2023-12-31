
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../Components/UserContext';
import './PersonalPage.css'; 
import Header from '../Components/header'; 

import { FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

import { FaRegComments }   from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegStar }       from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

import { FaEllipsisH } from "react-icons/fa";
import EditPost from '../Components/EditPost';
import Comment from '../Components/Comment';

function PersonalPage({ closeComment }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { editorData, uploadedImage } = location.state || {};
  const [likedStates, setLikedStates] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  console.log('User Data:', user);
  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);

  const [openComment, setOpenComment] = useState(false);
  useEffect(() => {
    if (openComment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openComment]);
  
  
  const renderContent = (content) => {
    return { __html: content.replace(/(?:\r\n|\r|\n)/g, '<br>') };
  };

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
      
            const response = await fetch(`http://localhost:5001/api/auth/posts/user/post`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user posts");
            }
            const data = await response.json();
            console.log("User Posts Data:", data);
            setUserPosts(data);
        } catch (error) {
            console.error("Error fetching user posts", error);
        }
    };

    fetchUserPosts();
}, []);

  return (
    <>
    <Header />
    {openModal && <EditPost closeModal={setOpenModal}/>}
    {openComment && <Comment closeComment={setOpenComment}/>}
    <div className="personal-flex-container">
        <div className='personal-post'>
            <div className='create-post'>
            <img className='homepage-personal-page'
                  src={user.avatarUrl} 
                  alt="Avatar"
                />
                <button onClick={()=>{navigate('/create', {replace:true})}}
                        className="home-create-post" 
                        type="submit" 
                        value="create-post" >Create Post</button>
            </div>
            <div className="editor-content">
              {userPosts.map((post) => (
                <div key={post.id} className="flex-container-home-user">
                
                <div className='editor-content'>
                <div className='user-home-user'>
                <span className='user-date'>At: {new Date(post.createdDate).toLocaleDateString()}</span>
                <span className='user-date'>{post.user.fullName}</span>
                </div>
                  <h1>{post.title}</h1>
                  {post.description && <p>{post.description}</p>}
                  {post.thumbnail && <img src={post.thumbnail} alt="Post Thumbnail" style={{ width: '600px', height: '400px' }} />}
                  {post.content && <p dangerouslySetInnerHTML={renderContent(post.content)}></p>}
                  <div className='home-interactions'>
                    <AiFillHeart className='number-interaction' />
                    <span className='numbers-comments-interaction'>{post.totalComments} Comments</span>

                  </div>
                  <div>
                    <hr className='home-hr' />
                  </div>
                  <div className="interaction">
                    <FaHeart
                      className="FaHeart"
                      onClick={() => handleClick(post.id.toString())}
                      style={{ color: likedStates[post.id.toString()] ? 'DeepPink' : 'Black' }}
                    />
                    <FaRegComments
                          className="FaRegComments"
                          onClick={() => setOpenComment(post)}
                        />
                    
                    <FaRegStar className="FaRegStar" />
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        
        <div className='form-personal'>
            <div className='personal'>
                <div className='background'></div>

                <img className='homepage-personal-page'
                  src={user.avatarUrl} 
                  alt="Avatar"
                />

                <div className='personal-informations'>
                    Fullname: {user.fullName}
                </div>
                <div className='personal-informations'>
                    Email: {user.email}
                </div>
                <div className='personal-informations'>
                    DOB: {user.dob}
                </div>
                <div className='personal-informations'>
                    Department: {user.department}
                </div>
                <div className='personal-informations'>
                    Student ID: {user.studentID}
                </div>
                <div className='upload'>
                    <button className='upload-image'>Upload Image</button>
                </div>
                <div className='add-social'>
                    <button className='bt-add-social'><FaPlus style={{ marginRight: '5px' }}/> Add social link </button>
                </div>

                <div className='seen-my-profile'>
                    <button onClick={()=>{navigate('/setting', {replace:true})}}
                    className='bt-profile'>My Profile</button>
                </div>

                <div className='personal-setting'>
                    <button onClick={()=>{navigate('/setting', {replace:true})}}
                    className='bt-setting'><IoSettingsSharp style={{ marginRight: '5px' }}/> Setting </button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default PersonalPage;
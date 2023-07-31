// src/Profile.js
import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Link } from 'react-router-dom';

const Profile = () => {
    const user = {
        username: 'john_doe',
        fullName: 'John Doe',
        bio: 'Hello, I am John!',
        profilePicture: 'https://via.placeholder.com/150',
        posts: [
          {
            id: 1,
            imageUrl: 'https://via.placeholder.com/400',
            caption: 'Beautiful sunset',
          },
          {
            id: 2,
            imageUrl: 'https://via.placeholder.com/400',
            caption: 'Lovely nature',
          },
        ],
        followers: 1000,
        following: 500,
    };

  return (
    <>
        <NavBar/>
        <div className="container mx-auto px-4 w-full md:w-1/2">
        <div className="flex items-center mt-8">
            <img
            src={user.profilePicture}
            alt={user.username}
            className="w-24 h-24 rounded-full mr-4"
            />
            <div>
            <h2 className="text-xl text-green-500 font-bold">{user.username}</h2>
            <p>{user.fullName}</p>
            <p className="text-gray-600">{user.bio}</p>
            <div className="mt-4">
                <span className="mr-2">
                <strong>{user.posts.length}</strong> posts
                </span>
                <span className="mr-2">
                <strong>{user.followers}</strong> followers
                </span>
                <span>
                <strong>{user.following}</strong> following
                </span>
            </div>
            </div>
        </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
                {user.posts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id}>
                    <img src={post.imageUrl} alt={post.caption} className="w-full rounded" />
                </Link>
                ))}
            </div>
        </div>
    </>
  );
};

export default Profile;

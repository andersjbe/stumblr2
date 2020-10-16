import React from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './components/Post';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />

      <Post 
        post={{
          id: 1,
          text: 'This is just a test',
          user: {
            username: "Demo Testerson",
            profilePicUrl: 'https://avatars1.githubusercontent.com/u/62520351?s=460&u=55b9329cab60bcd8ed323f29212e021176a206c1&v=4'
          },
          mediaType: 'video',
          mediaUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1',
          likes: [1],
          reblogs: [2, 4],
          rebloggedFrom: 'somePerson'
        }}
      />
    </div>
  );
}

export default App;

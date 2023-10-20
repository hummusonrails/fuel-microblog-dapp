import { useEffect, useState } from 'react';
import "./App.css";

import { BlogContractAbi__factory } from './contracts';
import { BigNumberish, Provider, Wallet, BN } from 'fuels';
import { Fuel } from '@fuel-wallet/sdk';
import { IdentityOutput } from './contracts/BlogContractAbi';

// update with contract address
const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID!;

  function App() {
    const [connected, setConnected] = useState<boolean>(false);
    const [account, setAccount] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [postLengthWarning, setPostLengthWarning] = useState<string>("");
    
    const fuel = new Fuel();

    type PostOutput = {
      id: BigNumberish;
      author: IdentityOutput;
      content: string;
    };

    type Post = {
      id: string;
      author: string;
      content: string;
    };

    useEffect(() => {
      setTimeout(() => {
        checkConnection();
        setLoaded(true);
      }, 200)
      if (connected) getPosts();
    }, [connected])

    function handlePostContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      const value = e.target.value;
      setNewPostContent(value);
  
      if (value.length > 280) {
        setPostLengthWarning("The post must be under 280 characters.");
      } else {
        setPostLengthWarning(""); 
      }
    }

    async function checkConnection() {
      const isConnected = await fuel.isConnected();
      if (isConnected) {
        const [account] = await fuel.accounts();
        setAccount(account);
        setConnected(true);
      }
      console.log('Connection status:', isConnected);
    }

    async function getPosts() {
      if (fuel) {
        const wallet = await fuel.getWallet(account);
        const contract = BlogContractAbi__factory.connect(CONTRACT_ID, wallet);
        // get the posts
        try { 
          const response = await contract.functions.get_posts_by_author().simulate();
          if (response.value) {
            const postsData: Post[] = response.value.map((postOutput: PostOutput) => ({
              id: postOutput.id.toString(),
              author: postOutput.author.Address?.value?.toString() ?? 'Unknown',
              content: postOutput.content
            }));          
            setPosts(postsData);
          }
        } catch (err) {
          console.log("error getting posts: ", err);
        }
      }
    }

    async function addPost() {
      if (fuel) {
        const wallet = await fuel.getWallet(account);
        const contract = BlogContractAbi__factory.connect(CONTRACT_ID, wallet);
        
        // check if newPostContent is less than 280 chars
        // If it is, add whitespace to the end to make up the difference
        const newPostContentLength = newPostContent.length;
        const whitespaceToAdd = 280 - newPostContentLength;
        const whitespace = Array(whitespaceToAdd).fill(" ").join("");
        const newPostContentWithWhitespace = newPostContent + whitespace;

        try {
          await contract.functions.post(newPostContentWithWhitespace).txParams({ gasPrice: 1 }).call();
          getPosts();
        } catch (error) {
          console.log("error posting: ", error);
        }
      }
    }

    if (!loaded) return null

    return (
      <>
        <div className="App">
          {connected && (
            <>
              <h2 className="main-header">My Little Micro-Blog</h2>


              <div className="add-post-section">
                <div className="post-user-avatar">
                    <img src="avatar_img.png" alt="User Avatar" className="post-avatar"/>
                </div>
                <div className="post-input-section">
                  <textarea 
                    value={newPostContent} 
                    onChange={handlePostContentChange} 
                    placeholder="What's happening?" 
                    className="post-textarea"
                  />
                  {postLengthWarning && <p style={{ color: 'red', marginTop: '5px' }}>{postLengthWarning}</p>}
                  <button 
                  onClick={addPost} 
                  className="post-button" 
                  disabled={!!postLengthWarning}
                  >
                  Post
                </button>
                </div>
              </div>

              <div className="posts-header">
                Your Posts
              </div>

              { posts.length > 0 ? (
                  posts.map((post, index) => (
                    <div className="post" key={index}>
                        <div className="post-header">
                            <img src="avatar_img.png" alt="Avatar" className="post-avatar" />
                            <span className="post-author">{`${post.author.slice(0,10)}...`}</span>
                        </div>
                        <p className="post-content">{post.content.trimEnd()}</p>
                    </div>
                  ))
                ) : (
                  <p>No posts yet</p>
                )
              }
            </>
          )}
        </div>
      </>
    );    
  }

  export default App;
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendPost } from '../../reducers/postblogReducer';
import { setStatusNotif } from "../../reducers/statusNotifReducer";
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import "./createPost.css";

function CreatePost() {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.token);
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postImagesPrev, setPostImagesPrev] = useState(null);
  const tx = useRef(null);

  useEffect(() => {
    //tx.current = document.querySelector(".crt-pst-txt");
    tx.current.setAttribute("style", "height:1.8em;overflow-y:hidden;");
    tx.current.addEventListener("input", OnInput, false);
    
    const txCleanUp = tx.current;

    return () => txCleanUp.removeEventListener("input", OnInput);
  }, []);

  useEffect(() => {
    if (postImagesPrev) {
      for (const imgUrl in postImagesPrev) {
        URL.revokeObjectURL(imgUrl);
      }
      setPostImagesPrev(null);
    }
    if (postImages.length > 0) {
      //const temp = [];
      // for (const img in Object.values(postImages)) {
      //   console.log(Object.values(postImages));
      //   temp.push(URL.createObjectURL(img));
      // };
      // Object.values(postImages).forEach(img => {
      //   console.log(img);
      // })
      setPostImagesPrev( Object.values(postImages).map(img => URL.createObjectURL(img)) );
    }
  }, [postImages]);

  function OnInput() {
    this.style.height = "1.75em";
    this.style.height = this.scrollHeight + "px";
  };

  function handleSubmit(e) {
    e.preventDefault();

    if ( !postText ) {
      dispatch(setStatusNotif("SET_ERR_NOTIF", "Cannot create a post without text", 3));
      return;
    }

    const postContent = new FormData();
    postContent.append("postText", postText);

    if (postImages.length > 0) {
      Array.from(postImages).forEach(postImage => {
        postContent.append("photos", postImage);
      });
    };

    dispatch(sendPost(postContent, userToken));
  };
  console.log(postImagesPrev);

  return (
    <div className={`crt-pst ${postImagesPrev ? "crt-pst--prev-active" : "" }`}>

      {
        postImagesPrev &&
        <div className="crt-pst__img-prv-ctn"> 
          <MediaCarousel 
            postId={0}
            postImages={postImagesPrev}
            inPrev={ true }
          />
        </div>
      }
      
      <form id="new-post-form" onSubmit={(e) => handleSubmit(e)}
      encType="multipart/form-data">

        <textarea className="crt-pst-txt" type="text" 
        name="post-text" 
        onChange={(e) => setPostText(e.target.value)} 
        value={ postText }
        placeholder="What's on your mind?..."
        required
        ref={ tx }
        />

        <label 
        className="crt-pst-lbl" 
        htmlFor="upld-pst">
          Choose photos

          <input 
          id="upld-pst" 
          type="file" 
          name="photos" 
          accept=".jpg,.jpeg,.png,.gif" 
          onChange={(e) => setPostImages(e.target.files)} 
          multiple
          /> 
        </label>

        <button type="submit">
          Post
        </button>
     </form>
    </div>
  )
}

export default CreatePost;
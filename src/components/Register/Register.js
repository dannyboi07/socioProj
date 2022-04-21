import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { setStatusNotif } from '../../reducers/statusNotifReducer';
import { dispatchRegister } from '../../reducers/userReducer';
import "./register.css";

function Register() {
  const dispatch = useDispatch();

  const [profileimg, setProfileimg] = useState(null);
  const [profPrev, setProfPrev] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const regFormRef = useRef(null);
  
  useEffect(() => {
    URL.revokeObjectURL(profileimg);
    setProfPrev(null);

    if (profileimg) {
      regFormRef.current.classList.add("form-modify");
      setProfPrev(URL.createObjectURL(profileimg));
    }
    else regFormRef.current.classList.remove("form-modify");

  }, [profileimg]);

  function handleSubmit(e) {
    e.preventDefault();

    if (/ /.test(username)) {
      dispatch(setStatusNotif("SET_ERR_NOTIF", "Username cannot contain spaces", 3));
      return;
    };

    const data = new FormData();
    
    if (profileimg) {
      const imgFileName = document.getElementById("prof-img").value;
      const dotIdx = imgFileName.lastIndexOf(".") + 1;
      const fileExt = imgFileName.substring(dotIdx, imgFileName.length).toLowerCase();
      if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png" && fileExt !== "gif") {
        dispatch(setStatusNotif("SET_ERR_NOTIF", "Profile image must be of type .jpg, .jpeg, .png, or .gif", 3));
        return;
      };

      data.append("profileimg", profileimg);
    };

    data.append("name", name.trim());
    data.append("username", username);
    data.append("password", password);
    // console.log("data", data);

    // const userDetails = { name, username, password, data };
    dispatch(dispatchRegister(data));
  }

  function handleProfChange(e) {
    // console.log(e.target.files[0]);
    setProfileimg(e.target.files[0]);
  }

  return (
    <div className="register-ctn">
      <div className="register-font">
        <h1>
          Socio
        </h1>

        <p>
          Join now and connect with others
        </p>
      </div>

      <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data" ref={ regFormRef }>
        <div className="img-upload-ctn">
          Upload a profile image
          { 
            !profileimg && 
            <span>
              (A default will be chosen if not uploaded)
            </span> 
          }
          { 
            profileimg && 
            <div className="pre-profimg-ctn">
              <img className="pre-profimg" src={profPrev} alt="Profile"/>
            </div> 
          }

          <label  className="img-upload-style-lbl">
            <span>
              {
                profileimg ? "Change " : "Choose "
              } 
              Picture
            </span>
            
            <input 
            id="prof-img" 
            type="file" 
            name="profileimg" 
            accept='.jpg,.jpeg,.png,.gif' 
            onChange={(e) => handleProfChange(e)}/>
          </label>

        </div>

        <div className="reg-inp-ctn">
          Name

          <input 
          type="text" 
          name='name'
          value={ name }
          onChange={(e) => setName(e.target.value)}/>
        </div>

        <div className="reg-inp-ctn">
          Username

          <input 
          type="text" 
          name="username"
          value={ username } 
          onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className="reg-inp-ctn">
          Password

          <input 
          type="password" 
          name="password"
          value={ password }
          onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <button type="submit">
          Create Account
        </button>
      </form>

    </div>
  );
}

export default Register;


// const [testing, setTesting] = useState(null);

// function testOnSubmit(e) {
//   e.preventDefault();
//   const data = new FormData();
//   data.append("testimg", testing);

//   fetch("http://localhost:3500/api/register/test", {
//     method: "POST",
//     body: data
//   }).then(res => console.log(res))
//   .catch(err => console.error(err));
// }
/* <form onSubmit={testOnSubmit}>
<input type="file" name="testimg" onChange={(e) => setTesting(e.target.files[0])}/>
<button type="submit">Submit</button>
</form> */
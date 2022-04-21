import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clrPosts, getAll } from '../../reducers/postblogReducer';
import PostsCtn from '../PostBodyCtn/PostsCtn';
// import useIsMount from '../../hooks/useIsMount';
// import CreateToolsCtn from '../createTools/CreateToolsCtn';
import { SecBgDiv } from '../../styledComponents/SecBgDiv';
import "./home.css"

function Home() {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user?.token) 
  // const history = useHistory();
  // const isFirstRender = useIsMount();

  useEffect(() => {
    //const userDetails = JSON.parse(window.localStorage.getItem("socioUser"));
    userToken ? dispatch(getAll(userToken)) : dispatch(getAll());

    return () => dispatch(clrPosts());
  }, []);

  return (
    <SecBgDiv 
    className="home-ctn">
      <PostsCtn/>
    </SecBgDiv>
  )
}

export default Home;

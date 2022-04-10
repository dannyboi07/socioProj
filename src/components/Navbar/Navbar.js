import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { dispatchLogOut } from '../../reducers/userReducer';
import { setCrData } from '../../reducers/fullScreenReducer';
import { getSearch } from '../../services/searchService';
import Profile from '../Profile/Profile';
import "./navbar.css";
import Notif from '../Notif/Notif';
import LoadingComp from '../LoadingComp/LoadingComp';
import { removeNotif, getAllNotifs, clearNotifs } from '../../reducers/notificationReducer';
import { getNotifsCount } from '../../services/notifService';
import NotifsCtn from '../NotifsCtn/NotifsCtn';
import FailureComp from '../FailureComp/FailureComp';

function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const search = useRef(null);
    // const searchFocusRef = useRef(null);
    const [searchRes, setSearchRes] = useState(null);

    const notifs = useSelector(state => state.notifs );
    const failureState = useSelector(state => state.failure?.type === "NOTIF");
    const [notifState, setNotifState] = useState({ display: "none" });
    const [notifCount, setNotifCount] = useState(0);
    const notifsRef = useRef(null);
    const notifRef = useRef(null);
    const notifMobRef = useRef(null);

    useEffect(() => {

        if (user) getNotifsCount(user.token)
        .then(res => setNotifCount(res.count))
        .catch(err => console.error(err));

        // searchFocusRef.current.addEventListener("onfocusout", clrSearchFcs);
        // notifRef.current.addEventListener("onfocus", () => handleNotifToggle());
        // const searchFocusRefCleanUp = searchFocusRef.current;

        return () => {
            // searchFocusRefCleanUp.removeEventListener("blur", clrSearchFcs);
            // notifRef.current.removeEventListener("onfocus", () => handleNotifToggle());
        };
    }, []);

    useEffect(() => {

        if (notifs) {
            getNotifsCount(user.token)
                .then(res => setNotifCount(res.count))
                .catch(err => console.error(err));
        };
    }, [notifs, user]);

    function clrSearchFcs(e) {
        e.target.value = null;
        search.current = null;
        setSearchRes(null);
    };

    function logOut() {
        dispatch(dispatchLogOut());
    };

    function dispatchCrPost() {
        dispatch(setCrData());
    };

    async function handleSearchChange(e) {
        // console.log("search changed");
        search.current = e.target.value;
        if (search.current && search.current !== "" && search.current !== " ") setSearchRes(await getSearch(search.current)) 
        else setSearchRes(null);
    };

    function handleNotifToggle() {
        let timer = null;
        if (notifState.display === "none") {
            // console.log("toggled if");
            dispatch(getAllNotifs(user.token));
            if (timer) clearTimeout(timer);

            timer = setTimeout(() => {
                setNotifState({ display: "block" })

                setTimeout(() => {
                    if (window.screen.width > 765) notifsRef.current.classList.add("notif-ctn--active");
                    else notifMobRef.current.classList.add("notif-ctn--active");
                }, 15);
            }, 0);
        }
        else if (notifState.display === "block") {
            // console.log("toggled else");
            if (timer) clearTimeout(timer);

            if (window.screen.width > 765) notifsRef.current.classList.remove("notif-ctn--active");
            else notifMobRef.current.classList.remove("notif-ctn--active");

            timer = setTimeout(() => {
                setNotifState({ display: "none" });
                dispatch(clearNotifs());
            }, 150);
        };
    };

    function handleAllRead() {
        notifs.forEach(notif => {
            dispatch(removeNotif(user.token, notif.primaryKey));
        });
    };

    return (
        <>
            <div 
            className="nav-container-desktop">
                <Link to="/home" 
                className='logo'>
                    <h3>Socio</h3>
                </Link>

                <div 
                className="search-ctn">

                    <input type="text" name="search-box" 
                    onChange={e => handleSearchChange(e)} 
                    placeholder="Search..." 
                    onBlur={e => clrSearchFcs(e)} />

                    <div className={ search.current 
                        ? searchRes 
                            ? "search-results-ctn" 
                            : "search-results-ctn no-res-ctn" 
                        : "hide-res-ctn" }>
                        {
                            searchRes && searchRes.map(res => 
                                <Profile key={res.u_id} 
                                name={ res.name } 
                                username={ res.username } 
                                profImgSrc={ res.imgloc }
                                />)
                        }
                        {
                            search.current && !searchRes && 
                                <p className="no-res-fnd">
                                    No results found
                                </p>
                        }
                    </div>
                </div>

                <nav className="desktop-nav">

                    <div className={`reg-log-btn-ctn${ user 
                        ? " reg-log-btn-ctn--lgout"
                        : "" }`}>
                        { user 
                            ? 
                            <>
                                <Link to="/home" title="Home">
                                    <img src="/icon-home.png" alt="Home" />
                                </Link>

                                <div className="noti-icon" 
                                onClick={ handleNotifToggle }
                                title="Notifications"
                                ref={ notifRef }>
                                    <div className="no-of-notifs">
                                        <p>
                                            {
                                                notifCount || 0
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {/* <NotifsCtn 
                                handleNotifToggle={ handleNotifToggle } 
                                ref={ notifsRef }
                                /> */}

                                {/*
                                    I decided to not use the dedicated component i.e <NotifsCtn /> cause when I go that route,
                                    and upon failure of retrieving notifications, the moment the failure state 
                                    changes from false to true, the Navbar comp rerenders and unmounts the NotifsCtn 
                                    component (Why? I haven't pinned it down yet, idk why cause Navbar wasn't subscribed
                                    to failureState when I tried using the dedicated comp), which would cause the user 
                                    to click again to open the notifs container and read the error. And on clicking 
                                    reload notifs, the component unmounts again. Pretty damn annoying IMO. So the whole 
                                    component code has been inserted here instead of using the dedi comp
                                */}
                                <div 
                                className={`notifs-ctn ${notifs?.length === 0 ? "no-notifs" : "" }`}
                                ref={ notifsRef }>
                                    {
                                        failureState ? 
                                            <FailureComp />
                                        : notifs ?
                                            notifs.length === 0 ?
                                                <p>
                                                    No notifications
                                                </p>
                                            :   <>
                                                    <button 
                                                    className="mrk-all-rd"
                                                    onClick={handleAllRead}>
                                                        Mark all as read
                                                    </button>
                                                    {
                                                        notifs.map(notif => 
                                                            <Notif key={notif.primaryKey} 
                                                            notif={notif} handleNotifToggle={handleNotifToggle}/>
                                                        )
                                                    } 
                                                </>
                                        :   <LoadingComp mini={ true }/>
                                    }
                                </div>

                                <div className="create-icon"
                                title="Create a post" 
                                onClick={dispatchCrPost}/>

                                <Link to="/messages"
                                title="Messages">
                                    <div className="dm-icon" />
                                </Link>
                                
                                <Link to="/login" 
                                title="Log out"
                                onClick={logOut}>
                                    <div className="logout-icon" />
                                </Link>
                            </> 
                            : <>
                                <Link to="/home" title='Home'>
                                    <img src="/icon-home.png" alt="Home" />
                                </Link>

                                <Link to="/register" className='reg-button' title='Create Account'>
                                    <img src="/register.png" alt="register" />
                                </Link>
                                
                                <Link to="/login" className='log-button' title='Login'>
                                    <div></div>
                                </Link>
                            </> 
                        }
                    </div>
                </nav>
            </div>

            <div className="nav-container-mobile">
                <Link to="/home" className='logo'>
                    {/* Blog<span>!</span><span>T</span> */}
                    {/* <img src="/logo1.png" alt="logo" /> */}
                    <h3>Socio</h3>
                </Link>

                <div className="search-ctn">

                    <input type="text" name="search-box" 
                    onChange={e => handleSearchChange(e)} 
                    placeholder="Search..."/>

                    <div className={ search.current 
                        ? searchRes 
                            ? "search-results-ctn" 
                            : "search-results-ctn no-res-ctn" 
                        : "hide-res-ctn" }>
                        {
                            searchRes && searchRes.map(res => 
                                <Profile key={res.u_id} name={ res.name } username={ res.username } profImgSrc={ res.imgloc }
                                />)
                        }
                        {
                            search.current && !searchRes && 
                                <p className="no-res-fnd">
                                    No results found
                                </p>
                        }
                    </div>
                </div>
            </div>

            <nav className="mobile-nav">

                <div className={`reg-log-btn-ctn${ user 
                    ? " reg-log-btn-ctn--lgout"
                    : "" }`}>
                    { user 
                        ? 
                          <>
                            <Link to="/home">
                                <img src="/icon-home.png" alt="Home" />
                            </Link>

                            <div className="noti-icon" 
                                onClick={ handleNotifToggle }
                                ref={ notifMobRef }>
                                    <div className="no-of-notifs">
                                        <p>
                                            {
                                                notifCount || 0
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div 
                                className={`notifs-mob-ctn ${notifs?.length === 0 ? "no-notifs" : "" }`}
                                ref={ notifMobRef }>
                                    {
                                        failureState ? 
                                            <FailureComp />
                                        : notifs ?
                                            notifs.length === 0 ?
                                                <p>
                                                    No notifications
                                                </p>
                                            :   <>
                                                    <button 
                                                    className="mrk-all-rd"
                                                    onClick={handleAllRead}>
                                                        Mark all as read
                                                    </button>
                                                    {
                                                        notifs.map(notif => 
                                                            <Notif key={notif.primaryKey} 
                                                            notif={notif} handleNotifToggle={handleNotifToggle}/>
                                                        )
                                                    } 
                                                </>
                                        :   <LoadingComp mini={ true }/>
                                    }
                                </div>
                            
                            <div className="create-icon" onClick={dispatchCrPost} />

                            <Link to="/messages"
                                title="Messages">
                                    <div className="dm-icon" />
                            </Link>
                            
                            <Link to="/login" onClick={logOut}>
                                <div className="logout-icon"></div>
                            </Link>
                          </> 
                        : <>
                                <Link to="/home" title='Home'>
                                    <img src="/icon-home.png" alt="Home" />
                                </Link>

                                <Link to="/register" className='reg-button' title='Create Account'>
                                    <img src="/register.png" alt="register" />
                                </Link>
                                
                                <Link to="/login" className='log-button' title='Login'>
                                    <div></div>
                                </Link>
                          </> 
                    }
                </div>
            </nav>
        </>
    );
}

export default Navbar;

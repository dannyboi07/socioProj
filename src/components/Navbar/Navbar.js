import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { dispatchLogOut } from "../../reducers/userReducer";
import { setCrData } from "../../reducers/fullScreenReducer";

import homeBlack from "../../assets/home-b.svg";
import homeWhite from "../../assets/home-w.svg";
import dmBlack from "../../assets/dmBlack.svg";
import dmWhite from "../../assets/dmWhite.svg";
import notifBlack from "../../assets/notif-b.svg";
import notifWhite from "../../assets/notif-w.svg";
import createBlack from "../../assets/create-b.svg";
import createWhite from "../../assets/create-w.svg";
import settingsBlack from "../../assets/settings-b.svg";
import settingsWhite from "../../assets/settings-w.svg";
import logoutBlack from "../../assets/logout-b.svg";
import logoutWhite from "../../assets/logout-w.svg";
import registerBlack from "../../assets/register-b.svg";
import registerWhite from "../../assets/register-w.svg";
import loginBlack from "../../assets/login-b.svg";
import loginWhite from "../../assets/login-w.svg";

import { getSearch } from "../../services/searchService";
import Profile from "../Profile/Profile";
import Notif from "../Notif/Notif";
import LoadingComp from "../LoadingComp/LoadingComp";

import Input from "../../styledComponents/Input";
import Logo from "../../styledComponents/Logo";
import { PrimBgDiv } from "../../styledComponents/PrimBgDiv";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";

import {
	removeNotif,
	getAllNotifs,
	clearNotifs,
} from "../../reducers/notificationReducer";
import { getNotifsCount } from "../../services/notifService";
// import NotifsCtn from '../NotifsCtn/NotifsCtn';
import FailureComp from "../FailureComp/FailureComp";
import { setTheme } from "../../reducers/themeReducer";
import { Text } from "../../styledComponents/Text";
import { Button } from "../../styledComponents/Button";

import "./navbar.css";

function Navbar() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const primCol = useSelector((state) => state.theme?.bgPrim);

	const search = useRef(null);
	// const searchFocusRef = useRef(null);
	const [searchRes, setSearchRes] = useState(null);

	const notifs = useSelector((state) => state.notifs);
	const failureState = useSelector(
		(state) => state.failure?.type === "NOTIF",
	);
	const [notifState, setNotifState] = useState({ display: "none" });
	const [notifCount, setNotifCount] = useState(0);
	const [settingState, setSettingState] = useState({ display: "none" });
	const [contrast, setContrast] = useState(false); // Default set as black

	const notifsRef = useRef(null);
	// const notifRef = useRef(null);
	const notifsMobRef = useRef(null);

	const settingsToggleRef = useRef(null);
	const settingsRef = useRef(null);

	const settingsToggleMobRef = useRef(null);
	const settingsMobRef = useRef(null);

	useEffect(() => {
		if (user) {
			getNotifsCount(user.token)
				.then((res) => setNotifCount(res.count))
				.catch((err) => console.error(err));
		}

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
				.then((res) => setNotifCount(res.count))
				.catch((err) => console.error(err));
		}
	}, [notifs, user]);

	useEffect(() => {
		function darkerIcons() {
			const r = parseInt(primCol.substring(1, 3), 16);
			const g = parseInt(primCol.substring(3, 5), 16);
			const b = parseInt(primCol.substring(5, 7), 16);

			return r * 0.299 + g * 0.587 + b * 0.114 > 100;
		}
		setContrast(darkerIcons());
		// Calling this as a bug fix cause when the theme is changed i.e global state theme primCol changes,
		// the Navbar is triggered to rerender, but the classes on settingsToggleRef & settingsRef don't reset,
		// since the classLists on stored on useRefs which don't change across renders aka in this case
		// the classes on the Refs don't change since useRefs stay the same across rerenders
		// but the toggle box collapses since the display state on it comes from a state variable
		// which when the Navbar rerenders goes back to the default declaration state of display: none
		if (settingState.display === "block") settingsToggle();
	}, [primCol]);

	function clrSearchFcs(e) {
		e.target.value = null;
		search.current = null;
		setSearchRes(null);
	}

	function logOut() {
		dispatch(dispatchLogOut());
	}

	function dispatchCrPost() {
		dispatch(setCrData());
	}

	async function handleSearchChange(e) {
		search.current = e.target.value;
		if (search.current && search.current !== "" && search.current !== " ")
			setSearchRes(await getSearch(search.current));
		else setSearchRes(null);
	}

	function handleNotifToggle() {
		let timer = null;
		if (notifState.display === "none") {
			dispatch(getAllNotifs(user.token));
			if (timer) clearTimeout(timer);

			timer = setTimeout(() => {
				setNotifState({ display: "block" });

				setTimeout(() => {
					if (window.screen.width > 765)
						notifsRef.current.classList.add("notifs-ctn--active");
					else
						notifsMobRef.current.classList.add(
							"notifs-ctn--active",
						);
				}, 15);
			}, 0);
		} else if (notifState.display === "block") {
			if (timer) clearTimeout(timer);

			if (window.screen.width > 765)
				notifsRef.current.classList.remove("notifs-ctn--active");
			else notifsMobRef.current.classList.remove("notifs-ctn--active");

			timer = setTimeout(() => {
				setNotifState({ display: "none" });
				dispatch(clearNotifs());
			}, 150);
		}
	}

	function handleAllRead() {
		notifs.forEach((notif) => {
			dispatch(removeNotif(user.token, notif.primaryKey));
		});
	}

	function settingsToggle() {
		let timer = null;

		if (settingState.display === "none") {
			if (timer) clearTimeout(timer);

			timer = setTimeout(() => {
				setSettingState({ display: "block" });

				if (window.screen.width < 769)
					settingsToggleMobRef.current.classList.add(
						"reg-log-btn-ctn__settings-toggle--rotate",
					);
				else
					settingsToggleRef.current.classList.add(
						"reg-log-btn-ctn__settings-toggle--rotate",
					);

				setTimeout(() => {
					if (window.screen.width < 769)
						settingsMobRef.current.classList.add(
							"reg-log-btn-ctn__settings-ctn--show",
						);
					else
						settingsRef.current.classList.add(
							"reg-log-btn-ctn__settings-ctn--show",
						);
				}, 15);
			}, 0);
		} else if (settingState.display === "block") {
			if (timer) clearTimeout(timer);

			if (window.screen.width < 769) {
				settingsMobRef.current.classList.remove(
					"reg-log-btn-ctn__settings-ctn--show",
				);
				settingsToggleMobRef.current.classList.remove(
					"reg-log-btn-ctn__settings-toggle--rotate",
				);
			} else {
				settingsToggleRef.current.classList.remove(
					"reg-log-btn-ctn__settings-toggle--rotate",
				);
				settingsRef.current.classList.remove(
					"reg-log-btn-ctn__settings-ctn--show",
				);
			}

			timer = setTimeout(() => {
				setSettingState({ display: "none" });
			}, 150);
		}
	}

	return (
		<>
			<PrimBgDiv className="nav-ctn-dsktp">
				<Link to="/home" className="logo">
					<Logo />
				</Link>

				<div className="search-ctn">
					<Input
						type="text"
						name="search-box"
						placeholder="Search..."
						onChange={handleSearchChange}
						onBlur={clrSearchFcs}
					/>

					<PrimBgDiv
						className={
							search.current
								? searchRes
									? "search-ctn__search-res-ctn"
									: "search-ctn__search-res-ctn search-ctn__search-res-ctn--no-res"
								: "search-ctn__search-res-ctn--hide-res"
						}
					>
						{searchRes &&
							searchRes.map((res) => (
								<Profile
									key={res.u_id}
									name={res.name}
									username={res.username}
									profImgSrc={res.imgloc}
								/>
							))}
						{search.current && !searchRes && (
							<p className="no-res-fnd">No results found</p>
						)}
					</PrimBgDiv>
				</div>

				<nav className="dsktp-nav">
					<div
						className={
							user
								? "reg-log-btn-ctn"
								: "reg-log-btn-ctn reg-log-btn-ctn--not-logged"
						}
					>
						{user ? (
							<>
								<Link to="/home" title="Home">
									{contrast ? (
										<img
											src={homeBlack}
											alt="Home"
											title="Home"
										/>
									) : (
										<img
											src={homeWhite}
											alt="Home"
											title="Home"
										/>
									)}
								</Link>

								<div
									className="noti-icon"
									onClick={handleNotifToggle}
									title="Notifications"
								>
									{contrast ? (
										<img
											src={notifBlack}
											alt="Notifications toggle"
										/>
									) : (
										<img
											src={notifWhite}
											alt="Notifications toggle"
										/>
									)}

									<div className="noti-icon__no-of-notifs">
										<p>{notifCount || 0}</p>
									</div>
								</div>

								<SecBgDiv
									className={`notifs-ctn ${
										notifs?.length === 0
											? "notifs-ctn--no-notifs"
											: ""
									}`}
									ref={notifsRef}
								>
									{failureState ? (
										<FailureComp />
									) : notifs ? (
										notifs.length === 0 ? (
											<p>No notifications</p>
										) : (
											<>
												<button
													className="notifs-ctn__mrk-all-rd-btn"
													onClick={handleAllRead}
												>
													Mark all as read
												</button>
												{notifs.map((notif) => (
													<Notif
														key={notif.primaryKey}
														notif={notif}
														handleNotifToggle={
															handleNotifToggle
														}
													/>
												))}
											</>
										)
									) : (
										<LoadingComp mini={true} />
									)}
								</SecBgDiv>

								{contrast ? (
									<img
										className="reg-log-btn-ctn__create-icon"
										src={createBlack}
										alt="Create a post"
										title="Create a post"
										onClick={dispatchCrPost}
									/>
								) : (
									<img
										className="reg-log-btn-ctn__create-icon"
										src={createWhite}
										alt="Create a post"
										title="Create a post"
										onClick={dispatchCrPost}
									/>
								)}
								{/* <div className="reg-log-btn-ctn__create-icon"
                                title="Create a post"
                                onClick={dispatchCrPost}/> */}

								<Link to="/messages" title="Messages">
									{contrast ? (
										<img
											className="reg-log-btn-ctn__dm-icon"
											src={dmBlack}
											alt="Messages"
											title="Messages"
										/>
									) : (
										<img
											className="reg-log-btn-ctn__dm-icon"
											src={dmWhite}
											alt="Messages"
											title="Messages"
										/>
									)}
									{/* <div className="reg-log-btn-ctn__dm-icon" /> */}
								</Link>

								<div
									className="reg-log-btn-ctn__settings-toggle"
									title="Settings"
									onClick={settingsToggle}
									ref={settingsToggleRef}
								>
									{contrast ? (
										<img
											src={settingsBlack}
											alt="Settings"
										/>
									) : (
										<img
											src={settingsWhite}
											alt="Settings"
										/>
									)}
								</div>

								<SecBgDiv
									style={settingState}
									className="reg-log-btn-ctn__settings-ctn reg-log-btn-ctn__settings-ctn--dsktp"
									ref={settingsRef}
								>
									<div className="reg-log-btn-ctn__setting-ctn">
										<Text>Theme</Text>

										<Button
											onClick={() => dispatch(setTheme())}
										>
											Change
										</Button>
									</div>

									<Link
										className="reg-log-btn-ctn__setting-ctn reg-log-btn-ctn__setting-ctn--logout-link"
										to="/login"
										title="Log out"
										onClick={logOut}
									>
										<Text>Logout</Text>

										{contrast ? (
											<img
												src={logoutBlack}
												alt="Logout"
											/>
										) : (
											<img
												src={logoutWhite}
												alt="Logout"
											/>
										)}
									</Link>
								</SecBgDiv>
							</>
						) : (
							<>
								<Link to="/home" title="Home">
									{contrast ? (
										<img
											src={homeBlack}
											alt="Home"
											title="Home"
										/>
									) : (
										<img
											src={homeWhite}
											alt="Home"
											title="Home"
										/>
									)}
								</Link>

								<Link
									to="/register"
									className="reg-log-btn-ctn__reg-btn"
									title="Create Account"
								>
									{contrast ? (
										<img
											src={registerBlack}
											alt="Register"
											title="Register"
										/>
									) : (
										<img
											src={registerWhite}
											alt="Register"
											title="Register"
										/>
									)}
								</Link>

								<Link
									to="/login"
									className="reg-log-btn-ctn__log-btn"
									title="Login"
								>
									{contrast ? (
										<img
											src={loginBlack}
											alt="Login"
											title="Login"
										/>
									) : (
										<img
											src={loginWhite}
											alt="Login"
											title="Login"
										/>
									)}
								</Link>
							</>
						)}
					</div>
				</nav>
			</PrimBgDiv>

			<PrimBgDiv className="nav-ctn-mob">
				<Link to="/home" className="logo">
					<Logo />
				</Link>

				<div className="search-ctn">
					<Input
						type="text"
						name="search-box"
						onChange={(e) => handleSearchChange(e)}
						placeholder="Search..."
						onBlur={clrSearchFcs}
					/>

					<PrimBgDiv
						className={
							search.current
								? searchRes
									? "search-ctn__search-res-ctn"
									: "search-ctn__search-res-ctn search-ctn__search-res-ctn--no-res"
								: "search-ctn__search-res-ctn--hide-res"
						}
					>
						{searchRes &&
							searchRes.map((res) => (
								<Profile
									key={res.u_id}
									name={res.name}
									username={res.username}
									profImgSrc={res.imgloc}
								/>
							))}
						{search.current && !searchRes && (
							<p className="no-res-fnd">No results found</p>
						)}
					</PrimBgDiv>
				</div>
			</PrimBgDiv>

			<PrimBgDiv className="mob-nav">
				<div
					className={
						user
							? "reg-log-btn-ctn"
							: "reg-log-btn-ctn reg-log-btn-ctn--not-logged"
					}
				>
					{user ? (
						<>
							<Link to="/home" title="Home">
								{contrast ? (
									<img
										src={homeBlack}
										alt="Home"
										title="Home"
									/>
								) : (
									<img
										src={homeWhite}
										alt="Home"
										title="Home"
									/>
								)}
							</Link>

							<div
								className="noti-icon"
								onClick={handleNotifToggle}
							>
								{contrast ? (
									<img
										src={notifBlack}
										alt="Notifications toggle"
									/>
								) : (
									<img
										src={notifWhite}
										alt="Notifications toggle"
									/>
								)}

								<div className="noti-icon__no-of-notifs">
									<p>{notifCount || 0}</p>
								</div>
							</div>

							<SecBgDiv
								className={`notifs-mob-ctn ${
									notifs?.length === 0
										? "notifs-ctn--no-notifs"
										: ""
								}`}
								ref={notifsMobRef}
							>
								{failureState ? (
									<FailureComp />
								) : notifs ? (
									notifs.length === 0 ? (
										<p>No notifications</p>
									) : (
										<>
											<button
												className="notifs-ctn__mrk-all-rd-btn"
												onClick={handleAllRead}
											>
												Mark all as read
											</button>
											{notifs.map((notif) => (
												<Notif
													key={notif.primaryKey}
													notif={notif}
													handleNotifToggle={
														handleNotifToggle
													}
												/>
											))}
										</>
									)
								) : (
									<LoadingComp mini={true} />
								)}
							</SecBgDiv>

							{contrast ? (
								<img
									className="reg-log-btn-ctn__create-icon"
									src={createBlack}
									alt="Create a post"
									title="Create a post"
									onClick={dispatchCrPost}
								/>
							) : (
								<img
									className="reg-log-btn-ctn__create-icon"
									src={createWhite}
									alt="Create a post"
									title="Create a post"
									onClick={dispatchCrPost}
								/>
							)}

							<Link to="/messages" title="Messages">
								{contrast ? (
									<img
										className="reg-log-btn-ctn__dm-icon"
										src={dmBlack}
										alt="Messages"
										title="Messages"
									/>
								) : (
									<img
										className="reg-log-btn-ctn__dm-icon"
										src={dmWhite}
										alt="Messages"
										title="Messages"
									/>
								)}
							</Link>

							<div
								className="reg-log-btn-ctn__settings-toggle"
								onClick={settingsToggle}
								ref={settingsToggleMobRef}
							>
								{contrast ? (
									<img src={settingsBlack} alt="Settings" />
								) : (
									<img src={settingsWhite} alt="Settings" />
								)}
							</div>

							<SecBgDiv
								style={settingState}
								className="reg-log-btn-ctn__settings-ctn reg-log-btn-ctn__settings-ctn--mob"
								ref={settingsMobRef}
							>
								<div className="reg-log-btn-ctn__setting-ctn">
									<Text>Theme</Text>

									<Button
										onClick={() => dispatch(setTheme())}
									>
										Change
									</Button>
								</div>

								<Link
									className="reg-log-btn-ctn__setting-ctn reg-log-btn-ctn__setting-ctn--logout-link"
									to="/login"
									title="Log out"
									onClick={logOut}
								>
									<Text>Logout</Text>
									{contrast ? (
										<img src={logoutBlack} alt="Logout" />
									) : (
										<img src={logoutWhite} alt="Logout" />
									)}
								</Link>
							</SecBgDiv>
						</>
					) : (
						<>
							<Link to="/home" title="Home">
								{contrast ? (
									<img
										src={homeBlack}
										alt="Home"
										title="Home"
									/>
								) : (
									<img
										src={homeWhite}
										alt="Home"
										title="Home"
									/>
								)}
							</Link>

							<Link
								to="/register"
								className="reg-log-btn-ctn__reg-btn"
								title="Create Account"
							>
								{contrast ? (
									<img
										src={registerBlack}
										alt="Register"
										title="Register"
									/>
								) : (
									<img
										src={registerWhite}
										alt="Register"
										title="Register"
									/>
								)}
							</Link>

							<Link
								to="/login"
								className="reg-log-btn-ctn__log-btn"
								title="Login"
							>
								{contrast ? (
									<img
										src={loginBlack}
										alt="Login"
										title="Login"
									/>
								) : (
									<img
										src={loginWhite}
										alt="Login"
										title="Login"
									/>
								)}
							</Link>
						</>
					)}
				</div>
			</PrimBgDiv>
		</>
	);
}

export default Navbar;

{
	/* <NotifsCtn
handleNotifToggle={ handleNotifToggle }
ref={ notifsRef }
/> */
}

{
	/*
    I decided to not use the separate component i.e <NotifsCtn /> cause when I go that route,
    and upon failure of retrieving notifications, the moment the failure state
    changes from false to true, the Navbar comp rerenders and unmounts the NotifsCtn
    component (Why? I haven't pinned it down yet, idk why cause Navbar wasn't subscribed
    to failureState when I tried using the separate comp), which would cause the user
    to click again to open the notifs container and read the error. And on clicking
    reload notifs, the component unmounts again. Pretty damn annoying IMO. So the whole
    component code has been inserted here instead of using the separate comp
*/
}

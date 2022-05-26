import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFailure } from "../../reducers/failureReducer";
import { useHistory } from "react-router-dom";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";
import { Button } from "../../styledComponents/Button";
import notFoundImg from "../../assets/error-404.svg";
import "./failurecomp.css";

function FailureComp({ notFound }) {
	const failureState = useSelector(state => state.failure);
	const dispatch = useDispatch();
	const history = useHistory();

	if (notFound) {
		return (
			<SecBgDiv className="fail-fs-ctn">
				<div className="fail-ctn">
					<img src={notFoundImg} alt="404-icon" />
					<p>
                        Broken link
					</p>
					<Button
						className="frnd-btn"
						onClick={ () => history.replace("/home", null)}>
                        Back to home
					</Button>
				</div>
			</SecBgDiv>
		);
	}

	function handleRelClick() {
		if (typeof(failureState?.param) !== "object" && failureState.func && failureState.param) {
			dispatch((failureState.func)(failureState.param));
		}
		else if (failureState.func && failureState.param[0] && failureState.param[1]) {
			dispatch((failureState.func)(Object.values(failureState.param)[0], Object.values(failureState.param)[1]));
		}
		dispatch(setFailure("CLEAR", null));
	}

	function ReloadBtn({ onClick, children }) {

		if (children) return (
			<Button className="frnd-btn" onClick={onClick}>
				{
					children
				}
			</Button>
		);

		return (
			<Button className="frnd-btn" onClick={onClick}>
                Retry
			</Button>
		);
	}

	if (failureState) {

		if (failureState.type === "CONTENT" || failureState.type === "NOTIF" || failureState.type === "MSGING") {
			return (
				<div className="fail-ctn">
					<p>
                        Failed to load {
							failureState.type === "CONTENT" ?
								"content"
								:   failureState.type === "NOTIF" ?
									"notifications"
									:   "chat or messages"
						}
					</p>
					<ReloadBtn onClick={ handleRelClick } />
				</div>
			);
		}
		else if (failureState.type === "USER_PROF") {
			return (
				<div className="fail-ctn">
					<p>
                        Failed to find user or user doesn&apos;t exist
					</p>
					<ReloadBtn onClick={ handleRelClick } />
				</div>
			);
		}
		else if (failureState.type === "POST" || failureState.type === "ONLY_POST") {
			return (
				<div className="fail-ctn">
					<img src="/error-404.svg" alt="404-icon" />
					<p>
                        Failed to retrieve resource or it doesn&apos;t exist
					</p>
					<ReloadBtn
						onClick={ failureState.type === "POST" ?
							() => dispatch(setFailure("CLEAR", null))
							:   () => history.push("/home") }>
						{
							failureState.type === "POST" ?
								"Ok"
								:   "Back to home"
						}
					</ReloadBtn>
				</div>
			);
		}
		else if (failureState.type === "NEW_CHAT") {

			return (
				<div className="fail-ctn">
					<img className="fail-warning-img" src="/error-light.svg" alt="error" />
					<p>
                        Failed to get contacts
					</p>
				</div>
			);
		}
		// else if (failureState.type === "ONLY_POST") {
		//     return (
		//         <div className="fail-ctn">
		//             <img src="/error-404.svg" alt="404-icon" />

		//             <p>
		//                 Failed to retrieve resource or it doesn't exist
		//             </p>

		//             <ReloadBtn onClick={() => {history.push("/home")}}>
		//                 Back to home
		//             </ReloadBtn>
		//         </div>
		//     )
		// }
		// else if (failureState.type === "NOTIF") {
		//     return (
		//         <div className="fail-ctn">
		//             <p>
		//                 Failed to load notifications
		//             </p>
		//             <ReloadBtn onClick={ handleRelClick } />
		//         </div>
		//     )
		// }
	}
}

export default FailureComp;
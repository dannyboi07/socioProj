import React, { forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Notif from "../Notif/Notif";
import LoadingComp from "../LoadingComp/LoadingComp";
import { removeNotif } from "../../reducers/notificationReducer";
import FailureComp from "../FailureComp/FailureComp";

// eslint-disable-next-line react/display-name
const NotifsCtn = forwardRef(({ handleNotifToggle }, ref) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const notifs = useSelector((state) => state.notifs);
	const failureState = useSelector(
		(state) => state.failure?.type === "NOTIF",
	);

	function handleAllRead() {
		notifs.forEach((notif) => {
			dispatch(removeNotif(user.token, notif.primaryKey));
		});
	}

	if (failureState) {
		return (
			<div className="notifs-ctn" ref={ref}>
				<FailureComp />
			</div>
		);
	}

	return (
		<div
			className={`notifs-ctn ${notifs?.length === 0 ? "no-notifs" : ""}`}
			ref={ref}
		>
			{notifs ? (
				notifs.length === 0 ? (
					<p>No notifications</p>
				) : (
					<>
						<button className="mrk-all-rd" onClick={handleAllRead}>
							Mark all as read
						</button>
						{notifs.map((notif) => (
							<Notif
								key={notif.primaryKey}
								notif={notif}
								handleNotifToggle={handleNotifToggle}
							/>
						))}
					</>
				)
			) : (
				<LoadingComp mini={true} />
			)}
		</div>
	);
});

export default NotifsCtn;

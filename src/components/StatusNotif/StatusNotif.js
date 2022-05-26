import React from "react";
import { useSelector } from "react-redux";
import StyledStatusNotif from "../../styledComponents/StyledStatusNotif";
// Switched this component to styledComponents, no more css
// import "./statusnotif.css";

function StatusNotif() {
	const statusNotif = useSelector((state) => state.statusNotif);
	// const [classN, setClassN] = useState("");

	// useEffect(() => {
	//     if (statusNotif) {
	//         if (statusNotif.type === "ERR") setClassN("status-notif--err-active")
	//         else setClassN("status-notif--active");
	//     }
	//     else setClassN("")
	// }, [statusNotif])

	return (
		<StyledStatusNotif
			className={`status-notif ${
				statusNotif
					? statusNotif.type === "ERR"
						? "status-notif--err-active"
						: "status-notif--active"
					: ""
			}`}
		>
			{statusNotif && <p>{statusNotif.message}</p>}
		</StyledStatusNotif>
	);
}

export default StatusNotif;

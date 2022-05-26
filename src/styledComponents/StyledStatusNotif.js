import styled from "styled-components";
import okStatus from "../assets/ok-status.svg";
import errorStatus from "../assets/error-status.svg";

const StyledStatusNotif = styled.div`
	position: fixed;
	border-radius: 0.25em;
	left: 50%;
	transform: translateX(-50%) translateY(-51px);

	margin: 0 auto;
	height: 50px;
	width: 500px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.25s;
	overflow: hidden;
	z-index: 1;

	&::before {
		position: absolute;
		height: 100%;
		width: 50px;
		left: 0px;
	}

	& > p {
		display: inline-block;
		font-size: 0.925rem;
	}

	&.status-notif--active {
		background-color: #d7ffd9;
		transform: translateX(-50%) translateY(10px) !important;

		&::before {
			content: "";
			background-image: url(${okStatus});
			background-repeat: no-repeat;
			background-position: center;
			background-size: 30px 30px;
			background-color: #43a047;
		}
	}

	&.status-notif--err-active {
		background-color: #ffcccb;
		transform: translateX(-50%) translateY(10px) !important;

		&::before {
			content: "";
			background-image: url(${errorStatus});
			background-repeat: no-repeat;
			background-position: center;
			background-size: 32px 32px;
			background-color: #e53935;
		}
	}

	@media only screen and (max-width: 768px) {
		& {
			width: 80%;
			height: 60px;
			transform: translateX(-50%) translateY(-61px);
		}
	}
`;

export default StyledStatusNotif;

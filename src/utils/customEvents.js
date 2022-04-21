const { CustomEvent } = window;
const changeroute = new CustomEvent("changeroute", { detail: "/login" });

export default changeroute;
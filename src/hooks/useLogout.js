import { useNavigate } from "react-router-dom";

export default function useLogout() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return logout;

}
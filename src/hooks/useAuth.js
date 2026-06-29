import { useEffect, useState } from "react";

export default function useAuth() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

    }, []);

    const logout = () => {

        localStorage.clear();
        setUser(null);

    };

    return {

        user,
        logout

    };

}
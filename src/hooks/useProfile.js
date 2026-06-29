import { useEffect, useState } from "react";
import profileApi from "../api/profileApi";

export default function useProfile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        const response = await profileApi.getProfile();

        setProfile(response.data);

    };

    return {

        profile,
        loadProfile

    };

}
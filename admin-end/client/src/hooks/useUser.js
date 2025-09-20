import { getCurrentUser } from "@/lib/apiClient";
import { useEffect, useState } from "react";


export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function fetchUser() {
            try {
                const res = await getCurrentUser();
                setUser(res);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
        setLoading(false);
    }, [setLoading, setUser]);

    return { user, loading };
}

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useToast } from "@chakra-ui/react";

const useGetUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const toast = useToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`/api/users/profile/${username}`);
                const userData = await response.json();

                if (userData.status === "error" || userData.status === "fail") {
                    toast({
                        description: userData.data || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
                }
                if(userData.data.frozen){
                    setUser(null);
                    return;
                }
                setUser(userData);
            } catch (error) {
                toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [username,toast]);

    return { user, loading };
};

export default useGetUserProfile;

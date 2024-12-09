import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
    const toast = useToast();

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
            toast({
                description:"Please login to follow",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
                toast({
                    description: data.error|| "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
				return;
			}

			if (following) {
                toast({
                    description: `Unfollowed ${user.name}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
				user.followers.pop(); 
			} else {
                toast({
                    description: `Followed ${user.name}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
				user.followers.push(currentUser?._id);
			}
			setFollowing(!following);

			console.log(data);
		} catch (error) {
			toast({
                description: error.message || "An error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
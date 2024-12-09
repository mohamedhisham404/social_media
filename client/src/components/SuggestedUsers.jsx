import { Text, Flex, Box, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import SuggestedUser from "./SuggestedUser";

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (data.error) {
					toast({
                        description: data.error || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [toast]);

    return (
        <>
            <Text mb={4} fontWeight={"bold"}>
                Suggested Users
            </Text>

            <Flex direction={"column"} gap={4}>
            {!loading && suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex
                            key={idx}
                            gap={2}
                            alignItems={"center"}
                            p={"1"}
                            borderRadius={"md"}
                        >
                            {/* avatar skeleton */}
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            {/* username and fullname skeleton */}
                            <Flex w={"full"} flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90px"} />
                            </Flex>
                            {/* follow button skeleton */}
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"} />
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
        </>
    );
};

export default SuggestedUsers;

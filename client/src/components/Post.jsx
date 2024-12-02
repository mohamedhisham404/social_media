import {
    Avatar,
    Flex,
    Box,
    Text,
    Image,
    MenuList,
    MenuButton,
    MenuItem,
    Portal,
    Menu,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { CiMenuKebab } from "react-icons/ci";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

function Post({ post, postedBy }) {
    const toast = useToast();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const currrentuser = useRecoilValue(userAtom);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch("/api/users/profile/" + postedBy);
                const data = await response.json();

                if (data.status === "error" || data.status === "fail") {
                    toast({
                        description: data.data || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
                }

                setUser(data.data);
            } catch (error) {
                toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                setUser(null);
            }
        };

        getUser();
    }, [postedBy, toast]);

    if (!user) return null;

    const CopyPostContent = () => {
        navigator.clipboard.writeText(post.text).then(() => {
            toast({
                status: "success",
                description: "Post Content copied.",
                duration: 3000,
                isClosable: true,
            });
        });
    };

    const DeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this post?"))
                return;

            const response = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            let data;
            try {
                data = await response.json();
            } catch {
                if (response.status === 204) {
                    data = { status: "success" };
                } else {
                    throw new Error("Unexpected response format");
                }
            }

            if (data.status === "error" || data.status === "fail") {
                toast({
                    description: data.data || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            toast({
                description: "Post deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                description: error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex gap={3} mb={4} py={5}>
            {/* Left Sidebar with Avatar and Replies */}
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar
                    size="md"
                    name={user.name}
                    src={user?.profilePic}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${user.username}`);
                    }}
                />
                <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    {post.replies.length === 0 && (
                        <Text textAlign={"center"}>🥱</Text>
                    )}
                    {post.replies[0] && (
                        <Avatar
                            size="xs"
                            src={post.replies[0].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left="15px"
                            padding={"2px"}
                        />
                    )}
                    {post.replies[1] && (
                        <Avatar
                            size="xs"
                            src={post.replies[1].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left="-5px"
                            padding={"2px"}
                        />
                    )}
                    {post.replies[2] && (
                        <Avatar
                            size="xs"
                            src={post.replies[2].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left="4px"
                            padding={"2px"}
                        />
                    )}
                </Box>
            </Flex>

            {/* Main Content */}
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    {/* Username and Time */}
                    <Flex w={"full"} alignItems={"center"}>
                        <Text
                            fontSize={"sm"}
                            fontWeight={"bold"}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        >
                            {user?.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>

                    <Flex gap={4} alignItems={"center"}>
                        <Text
                            fontSize={"xs"}
                            width={36}
                            textAlign={"right"}
                            color={"gray.light"}
                        >
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                        </Text>

                        {/* Menu */}
                        <Box className="icon-container">
                            <Menu>
                                <MenuButton
                                    onClick={(e) => e.stopPropagation()} // Prevent event propagation
                                >
                                    <CiMenuKebab size={24} cursor={"pointer"} />
                                </MenuButton>
                                <Portal>
                                    <MenuList bg={"gray.dark"}>
                                        <MenuItem
                                            bg={"gray.dark"}
                                            onClick={CopyPostContent}
                                        >
                                            Copy Post Content
                                        </MenuItem>
                                        {currrentuser?._id === user._id && (
                                            <MenuItem
                                                bg={"gray.dark"}
                                                onClick={DeletePost}
                                            >
                                                Delete Post
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Box>
                    </Flex>
                </Flex>

                {/* Post Content */}
                <Link
                    to={`/${user.username}/post/${post._id}`}
                    style={{ textDecoration: "none" }}
                >
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                        >
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}
                </Link>

                {/* Actions */}
                <Flex gap={3} my={1}>
                    <Actions post={post} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Post;

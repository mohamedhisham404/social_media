import {
    Avatar,
    Flex,
    Text,
    Image,
    Box,
    Divider,
    Button,
    Spinner,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useParams } from "react-router";
import PostMenu from "../components/PostMenu";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const [post, setPost] = useState(null);
    const toast = useToast();
    const { pid } = useParams();
    const currrentuser = useRecoilValue(userAtom);

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();

                if (data.status === "error" || data.status === "faile") {
                    toast({
                        title: "Update Failed",
                        status: "error",
                        description: data.data,
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
                }
                setPost(data);
            } catch (error) {
                toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        getPost();
    }, [pid]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!post) return null;
    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={33}>
                    <Avatar
                        src={user.data.profilePic}
                        size={"md"}
                        name="Mohamed Hisham"
                    />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.data.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={4} />
                    </Flex>
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
                    <PostMenu
                        post={post}
                        user={user.data}
                        currrentuser={currrentuser}
                        toast={toast}
                        navigation={`/${user.data.username}`}
                    />
                </Flex>
            </Flex>

            <Text my={3}>{post.text}</Text>

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

            <Flex gap={3} my={3}>
                <Actions post={post} />
            </Flex>

            <Divider my={4} />

            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={"gray.light"}>
                        Get the app to like, reply and post.
                    </Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />

            {post.replies.map(reply =>(
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply = {reply._id === post.replies[post.replies.length - 1]._id}
                    currentUser={currrentuser}
                    toast={toast}
                />
            ))}
        </>
    );
};

export default PostPage;

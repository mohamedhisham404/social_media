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
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useParams } from "react-router";
import PostMenu from "../components/PostMenu";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";
import postsAtom from "../atoms/PostsAtom";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const toast = useToast();
    const { pid } = useParams();
    const currrentuser = useRecoilValue(userAtom);
    const [posts,setPosts] = useRecoilState(postsAtom)

    const currentPost = posts[0];
    useEffect(() => {
        const getPost = async () => {
            setPosts([])
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
                setPosts([data]);
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
    }, [pid,setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!currentPost) return null;
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
                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                    </Text>

                    {/* Menu */}
                    <PostMenu
                        post={currentPost}
                        user={user.data}
                        currrentuser={currrentuser}
                        toast={toast}
                        navigation={`/${user.data.username}`}
                    />
                </Flex>
            </Flex>

            <Text my={3}>{currentPost.text}</Text>

            {currentPost.img && (
                <Box
                    borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={"gray.light"}
                >
                    <Image src={currentPost.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
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

            {currentPost.replies.map(reply =>(
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply = {reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                    currentUser={currrentuser}
                    toast={toast}
                />
            ))}
        </>
    );
};

export default PostPage;

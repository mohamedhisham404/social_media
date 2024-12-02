import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import PostMenu from "./PostMenu";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ reply, lastReply, currentUser, toast }) => {
    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={reply.userProfilePic} size={"sm"} />
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex
                        w={"full"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {reply.username}
                        </Text>

                        <Flex gap={4} alignItems={"center"}>
                            <Text
                                fontSize={"xs"}
                                width={36}
                                textAlign={"right"}
                                color={"gray.light"}
                            >
                                {formatDistanceToNow(new Date(reply.createdAt))}{" "}
                                ago
                            </Text>

                            {/* Menu */}
                            <PostMenu
                                post={reply}
                                user={reply}
                                currrentuser={currentUser}
                                toast={toast}
                                isComment={true}
                            />
                        </Flex>
                    </Flex>

                    <Text> {reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider /> : null}
        </>
    );
};

export default Comment;

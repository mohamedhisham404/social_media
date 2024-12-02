import { Avatar, Divider, Flex, Text, Box } from "@chakra-ui/react";
import PostMenu from "./PostMenu";

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
                        {/* Menu Button */}
                        <Box className="icon-container">
                            <PostMenu
                                post={reply}
                                user={reply}
                                currrentuser={currentUser}
                                toast={toast}
                            />
                        </Box>
                    </Flex>

                    <Text> {reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider /> : null}
        </>
    );
};

export default Comment;
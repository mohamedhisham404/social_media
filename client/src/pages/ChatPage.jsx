import {
    Box,
    Button,
    Flex,
    Input,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons/Search";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../atoms/messagesAtom";

const ChatPage = () => {
    const toast = useToast();
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );

    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
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
                setConversations(data);
            } catch (error) {
                toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoadingConversations(false);
            }
        };
        getConversation();
    }, [toast, setConversations]);

    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{
                base: "100%",
                md: "80%",
                lg: "750px",
            }}
            transform={"translate(-50%)"}
            p={4}
        >
            <Flex
                gap={4}
                flexDirection={{ base: "column", md: "row" }}
                maxW={{
                    sm: "400px",
                    md: "full",
                }}
                mx={"auto"}
            >
                <Flex
                    flex={30}
                    gap={2}
                    flexDirection={"column"}
                    maxW={{
                        sm: "250px",
                        md: "full",
                    }}
                    mx={"auto"}
                >
                    <Text
                        fontWeight={700}
                        color={useColorModeValue("gray.600", "gray.400")}
                    >
                        Your Conversations
                    </Text>
                    <form>
                        <Flex alignItems={"center"} gap={2}>
                            <Input placeholder="Search for a user" />
                            <Button size={"sm"}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>
                    {loadingConversations &&
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <Flex
                                key={i}
                                gap={4}
                                alignItems={"center"}
                                p={1}
                                borderRadius={"md"}
                            >
                                <Box>
                                    <SkeletonCircle size={10} />
                                </Box>
                                <Flex
                                    w={"full"}
                                    flexDirection={"column"}
                                    gap={3}
                                >
                                    <Skeleton h={"10px"} w={"80px"} />
                                    <Skeleton h={"8px"} w={"90%"} />
                                </Flex>
                            </Flex>
                        ))}

                    {!loadingConversations &&
                        conversations.map((conversation) => (
                            <Conversation
                                key={conversation._id}
                                conversation={conversation}
                            />
                        ))}
                </Flex>
                {!selectedConversation._id && (
                    <Flex
                        flex={70}
                        borderRadius={"md"}
                        p={2}
                        flexDir={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        height={"400px"}
                    >
                        <GiConversation size={100} />
                        <Text fontSize={20}>
                            Select a Conversation to start messaging
                        </Text>
                    </Flex>
                )}

                {selectedConversation._id && <MessageContainer />}
            </Flex>
        </Box>
    );
};

export default ChatPage;

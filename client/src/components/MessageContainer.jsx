import {
    Avatar,
    Flex,
    useColorModeValue,
    Text,
    Image,
    Divider,
    SkeletonCircle,
    Skeleton,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SoketContext";


const MessageContainer = () => {
    const toast = useToast();
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );
    const[loadingMessages,setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([])
    const currentUser = useRecoilState(userAtom)
    const {socket} = useSocket()
    const [,setConversations] = useRecoilState(conversationsAtom)
    const messageEndRef= useRef(null)

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prev) => [...prev, message]);
            }
    
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender, 
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });
    
        return () => socket.off("newMessage");
    }, [socket, selectedConversation, setConversations, currentUser]);    

    useEffect(()=>{
        const getMessage = async ()=>{
            setLoadingMessages(true);
            setMessages([])
            try {
                if(selectedConversation.mock)return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
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
                setMessages(data)
            } catch (error) {
                toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }finally{
                setLoadingMessages(false);
            }
        }
        getMessage();
    },[toast,selectedConversation])

    useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

    return (
        <Flex
            flex={70}
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            flexDirection={"column"}
        >
            {/* Message header */}
            <Flex w={"full"} p={2} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                <Text display={"flex"} alignItems={"center"}>
                    {selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            {/* Message body */}
            <Flex
                flexDir={"column"}
                gap={4}
                my={4}
                height={"400px"}
                overflowY={"auto"}
                p={2}
            >
                {loadingMessages &&
                    [0, 1, 2, 3, 4].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i%2 === 0 ?"flex-start":"flex-end"}
                        >
                            {i %2 ===0 && <SkeletonCircle size={7}/>}
                            <Flex flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"250px"}/>
                                <Skeleton h={"8px"} w={"250px"}/>
                                <Skeleton h={"8px"} w={"250px"}/>
                            </Flex>
                            {i %2 !==0 && <SkeletonCircle size={7}/>}
                        </Flex>
                    ))}
                    {!loadingMessages &&(
                        
                        messages.map((msg) => (
                            <Flex key={msg._id} direction={"column"} 
                            ref={messages.length-1 === messages.indexOf(msg)?messageEndRef:null}>
                            <Message  message={msg} ownMessage={currentUser[0]._id === msg.sender}/>
                        </Flex>
                        ))
                    )}            
            </Flex>
            <MessageInput setMessages={setMessages}/>
        </Flex>
    );
};

export default MessageContainer;

import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
    const toast = useToast();


	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					toast({
                        description: data.error || "An error occurred",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
					return;
				}
				setConversations(data);
			} catch (error) {
				toast({
                    description: error.message || "An error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [toast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
            if(!searchText){
                toast({
                    description: "Type the username to search",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  return;
            }
			const res = await fetch(`/api/users/profile/${searchText}`);
			const data = await res.json();

            if (data.status == "error" || data.status === "faile") {
                toast({
                  description: data.data || "An error occurred",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }

			const messagingYourself = data.data._id === currentUser._id;
			if (messagingYourself) {
				toast({
                    description: "You can not message yourself",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === data.data._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: data.data._id,
					username: data.data.username,
					userProfilePic: data.data.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: data.data._id,
						username: data.data.username,
						profilePic: data.data.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			toast({
                description: error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "750px" }}
			p={4}
			transform={"translateX(-50%)"}
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
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
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
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;
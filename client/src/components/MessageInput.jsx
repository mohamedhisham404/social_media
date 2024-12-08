import {
	Flex,
	Input,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useToast } from "@chakra-ui/react";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
    const toast = useToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const [isSending, setIsSending] = useState(false);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText ) return;
		if (isSending) return;

		setIsSending(true);

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
				}),
			});
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
			setMessages((messages) => [...messages, data]);

			setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			setMessageText("");
		} catch (error) {
			toast({
				description: error.message || "An error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSending(false);
		}
	};
	return (
		<Flex gap={2} alignItems={"center"}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
	
		</Flex>
	);
};

export default MessageInput;
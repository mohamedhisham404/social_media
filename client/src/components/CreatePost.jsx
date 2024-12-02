import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    Text,
    useColorModeValue,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Textarea,
    Input,
    Flex,
    CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewimg from "../hooks/usePreviewimg";
import { BsFillImageFill } from "react-icons/bs";
import { useToast } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/PostsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const { handleImageChange, imgUrl, setImageUrl } = usePreviewimg();
    const imageRef = useRef(null);
    const [remainingChar, setRemaminingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const [updating, setUpdating] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom)

    const handleTxextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemaminingChar(0);
        } else {
            setPostText(inputText);
            setRemaminingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        if (updating) return;
        setUpdating(true);

        try {
            const respons = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postedBy: user._id,
                    text: postText,
                    img: imgUrl,
                }),
            });
            const data = await respons.json();
            if (data.status === "error" || data.status === "faile") {
                toast({
                    title: "Failed to post",
                    status: "error",
                    description: data.data,
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            toast({
                status: "success",
                description: "Post Created Successfully",
                duration: 3000,
                isClosable: true,
            });

            setPosts([data,...posts]);
            onClose();
            setPostText("");
            setImageUrl("");
        } catch (error) {
            toast({
                title: "Failed to post",
                status: "error",
                description: error,
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{
                    base:"sm",
                    sm: "md"
                }}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder="Post Content goes here"
                                onChange={handleTxextChange}
                                value={postText}
                            ></Textarea>
                            <Text
                                fontSize={"xs"}
                                fontWeight={"bold"}
                                textAlign={"right"}
                                m={1}
                                color={"gray.800"}
                            >
                                {remainingChar}/{MAX_CHAR}
                            </Text>
                            <Input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt="selected image" />
                                <CloseButton
                                    onClick={() => {
                                        setImageUrl("");
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            mr={3}
                            onClick={handleCreatePost}
                            isLoading={updating}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;

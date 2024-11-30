import { Avatar, Flex,Box,Text, Image } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router"
import {BsThreeDots} from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import {formatDistanceToNow} from "date-fns"

function Post({ post,postedBy }) {
    const toast = useToast();
    const [user,setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const response = await fetch("/api/users/profile/"+postedBy)
                const data = await response.json()

                if(data.status=="error" || data.status === "faile"){
                    toast({
                      description: data.data || "An error occurred",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                }

                setUser(data.data)
            } catch (error) {
                toast.error({
                    description: error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                setUser(null)
            }
        }

        getUser();
    },[postedBy,toast])
    
    if(!user) return null;

    return (
    <Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size='md' name={user.name} src={user?.profilePic}
                        onClick={(e) =>{
                            e.preventDefault();
                            navigate(`/${user.username}`)
                        }}
                    />
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
							size='xs'
							name='John doe'
							src={post.replies[0].userProfilePic}
							position={"absolute"}
							top={"0px"}
							left='15px'
							padding={"2px"}
						/>

                        )}
                        {post.replies[1] && (
                            <Avatar
							size='xs'
							name='John doe'
							src={post.replies[1].userProfilePic}
							position={"absolute"}
							top={"0px"}
							left='15px'
							padding={"2px"}
						/>
                        )}
                        {post.replies[2] && (
                            <Avatar
							size='xs'
							name='John doe'
							src={post.replies[2].userProfilePic}
							position={"absolute"}
							top={"0px"}
							left='15px'
							padding={"2px"}
						/>
                        )}
						
					</Box>
				</Flex>

				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>

						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}
                                onClick={(e) =>{
                                    e.preventDefault();
                                    navigate(`/${user.username}`)
                                }}
                            >
								{user?.username}
							</Text>
							<Image src='/verified.png' w={4} h={4} ml={1} />
						</Flex>

						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
							<BsThreeDots />
						</Flex>
					</Flex>

					<Text fontSize={"sm"}>{post.text}</Text>
					{post.img && (
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image src={post.img} w={"full"} />
						</Box>
					)}

					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
  )
}

export default Post
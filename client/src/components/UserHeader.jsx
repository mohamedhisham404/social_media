import { VStack ,Box, Flex, Avatar, Text, Link, MenuList,MenuButton, Menu, Portal, MenuItem, useToast, Button} from '@chakra-ui/react'
import {BsInstagram} from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink} from "react-router-dom"
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader =({user})=>{
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom);//this is logedin user
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user.data);
    const copyURL = ()=>{
        const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
    }
   
    return (
       <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={'space-between'} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.data.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.data.username}</Text>
                        <Text 
                            fontSize={"sm"}
                            bg={"gray.dark"}
                            color={"gray.light"}
                            p={1}
                            borderRadius={"full"}
                        >
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.data.profilePic &&(
                        <Avatar
                        name={user.data.name}
                        src={user.data.profilePic}
                        size={{
                            based:'md',
                            md:'xl',
                        }}
                    />
                    )}

                    {!user.data.profilePic &&(
                        <Avatar
                        name={user.data.name}
                        src="https://bit.ly/broken-link"
                        size={{
                            based:'md',
                            md:'xl',
                        }}
                        alt={user.data.name}
                    />
                    )}                    
                </Box>
            </Flex>

            <Text fontSize={"sm"}>
                {user.data.bio}
            </Text>

            {currentUser?._id === user.data._id &&(
                <Link as={RouterLink} to='/update'>
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )}

            {currentUser?._id !== user.data._id &&(
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                    {following?"Unfollow":"Follow"}
                </Button>
            )}

            <Flex w="full" justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.data.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"}/>
                    </Box>

                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"} onClick={copyURL}>
                                    <MenuItem bg={"gray.dark"}>
                                        Copy Link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					justifyContent={"center"}
					color={"gray.light"}
					pb='3'
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>
            
       </VStack>
    )
};

export default UserHeader;
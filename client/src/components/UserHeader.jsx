import { VStack ,Box, Flex, Avatar, Text, Link, MenuList,MenuButton, Menu, Portal, MenuItem, useToast} from '@chakra-ui/react'
import {BsInstagram} from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader =()=>{
    const toast = useToast();

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
                        Mohamed Hisham
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>@mohamedhisham</Text>
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
                    <Avatar
                        name='mohamed'
                        src="/1.jpg"
                        size={{
                            based:'md',
                            md:'xl',
                        }}
                        alt="mohamed"
                    />
                </Box>
            </Flex>

            <Text fontSize={"sm"}>
                 Vestibulum condimentum, tortor vitae gravida consectetur, nunc ligula fringilla nunc, at fermentum diam velit vel massa. In hac habitasse platea dictumst.
            </Text>

            <Flex w="full" justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>3.2k followers</Text>
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
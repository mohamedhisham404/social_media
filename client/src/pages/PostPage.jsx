import {Avatar,Flex,Text,Image,Box,Divider,Button,} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
// import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={33}>
          <Avatar src="/1.jpg" size={"md"} name="Mohamed Hisham" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              mohamedhisham
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            id
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>my post</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/2.jpg"} w={"full"} />
      </Box>

      {/* <Flex gap={3} my={3}>
        <Actions liked={liked} setliked={setLiked} />
      </Flex> */}

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          3 Replies
        </Text>

        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} Likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      <Comment userAvatar={"/2.jpg"} createdAt={"1d"} comment={"This is a commnt"} userName={"Mohamed Hisham"} likes={200}/>  
        
    </>
  );
};

export default PostPage;

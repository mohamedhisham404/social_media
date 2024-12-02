import { Flex, Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/PostsAtom";

const HomePage = () => {
    const toast = useToast();
    const [Posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/posts/feed");
                const data = await response.json();

                if(data.error){
                  toast({
                    title: "Error fetching feed posts",
                    description: data.error || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  return;
                }
                setPosts(data);
            } catch (error) {
                toast.error({
                    title: "Error fetching feed posts",
                    description: error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }finally{
               setLoading(false);
            }
        };
        
        getFeedPosts();
    },[toast,setPosts]);


    return (
      <>
        {!loading && Posts.length ===0 && <h1>Follow some users to see the feed</h1>}
      {loading &&(
          <Flex justify={"center"}>
            <Spinner size={"xl"}/>
          </Flex>
        )}

        {Posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
      </>
    );
};

export default HomePage;

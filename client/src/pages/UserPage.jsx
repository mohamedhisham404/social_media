import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import Post from '../components/Post';
import { useParams } from 'react-router';
import { Flex, Spinner, useToast } from "@chakra-ui/react";


const UserPage =()=>{
    const [user,setUser] = useState(null);
    const {username} = useParams();
    const toast = useToast();
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const [fetchingPosts, setFetchingPosts] = useState(true)

    useEffect(()=>{
        const getUser = async()=>{
            try{
                const response = await fetch(`/api/users/profile/${username}`);
                const userData = await response.json();
                
                if(userData.status === "error" || userData.status === "fail"){
                    toast({
                        description: userData.data || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      return;
                }
                setUser(userData);
            } catch(error){
                toast({
                    description: error.message|| "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });                
            }finally{
                setLoading(false);
            }
        }

        const getPosts = async ()=>{
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json();
                setPosts(data)
            } catch (error) {
                toast({
                    description: error.message|| "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                }); 
                setPosts([])
            }finally{
                setFetchingPosts(false);
            }
        }

        getPosts();
        getUser();
    },[username]);

    if(!user && loading){
        return(
            <Flex justifyContent={"center"}>
                <Spinner size="xl"/>
            </Flex>
        )
    }
    if(!user && !loading)return <h1>User Not Found</h1>;

    return (
        <>
            <UserHeader user={user}/>
            {!fetchingPosts && posts.length=== 0 && <h1>User has no posts.</h1>}
            {fetchingPosts && (
                <Flex justifyContent={"center"}>
                    <Spinner size="xl" my={12}/>
                </Flex>
            )}

            {posts.map((post) =>(
                <Post key={post._id} post={post} postedBy={post.postedBy}/>  
            ))}
        </>
    )
};

export default UserPage;
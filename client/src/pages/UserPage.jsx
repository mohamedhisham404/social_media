import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import Post from '../components/Post';
import { useParams } from 'react-router';
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile.js"
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/PostsAtom'

const UserPage =()=>{
    const {user,loading} = useGetUserProfile()
    const {username} = useParams();
    const toast = useToast();
    const [posts, setPosts] = useRecoilState(postAtom)
    const [fetchingPosts, setFetchingPosts] = useState(true)

    useEffect(()=>{
        const getPosts = async ()=>{
            if(!user)return;
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
    },[username,setPosts,toast,user]);
    
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
                <Post key={post._id} post={post} postedBy={post.postedBy} />  
            ))}
        </>
    )
};

export default UserPage;
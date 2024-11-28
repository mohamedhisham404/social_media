import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router';
import { useToast } from "@chakra-ui/react";


const UserPage =()=>{
    const [user,setUser] = useState(null);
    const {username} = useParams();
    const toast = useToast();


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
                    description: error|| "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });                
            }
        }

        getUser();
    },[username]);

    if(!user)return null;

    return (
        <>
            <UserHeader user={user}/>
            <UserPost postImg="/2.jpg" postTitle="it is first thread" likes={200} replies={4}/>
        </>
    )
};

export default UserPage;
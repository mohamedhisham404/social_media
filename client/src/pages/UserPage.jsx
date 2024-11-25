import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage =()=>{
    return (
        <>
            <UserHeader/>
            <UserPost postImg="/2.jpg" postTitle="it is first thread" likes={200} replies={4}/>
        </>
    )
};

export default UserPage;
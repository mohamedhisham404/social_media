// import { Button} from '@chakra-ui/react'
import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import Userpage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import UserProfileUpdate from "./pages/UserProfileUpdate";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";

function App() {
    const user = useRecoilValue(userAtom);
    return (
        <Box position={"relative"} w={'full'}>
            <Container maxW="620px">
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <>
                                    <HomePage />
                                    <CreatePost />
                                </>
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/auth"
                        element={!user ? <AuthPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/update"
                        element={
                            user ? (
                                <UserProfileUpdate />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/:username"
                        element={
                            user ? (
                                <>
                                    <Userpage />
                                    <CreatePost />
                                </>
                            ) : (
                                <Userpage />
                            )
                        }
                    />
                    <Route path="/:username/post/:pid" element={<PostPage />} />
                    <Route
                        path="/chat"
                        element={
                            user ? <ChatPage /> : <Navigate to={"/auth"} />
                        }
                    />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;

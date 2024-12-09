import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Userpage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import {SettingsPage} from "./pages/SettingsPage";
import UserProfileUpdate from "./pages/UserProfileUpdate";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";

function App() {
    const user = useRecoilValue(userAtom);
    const {pathname} = useLocation()
    return (
        <Box position={"relative"} w={"full"}>
            <Container maxW={pathname === '/'?{base:"620px",md:'900px'}:'620px'}>
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
                    <Route path="/:username/post/:pid" element={<PostPage />} />
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
                    <Route
                        path="/chat"
                        element={
                            user ? <ChatPage /> : <Navigate to={"/auth"} />
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            user ? <SettingsPage /> : <Navigate to={"/auth"} />
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;

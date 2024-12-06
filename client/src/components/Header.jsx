import { Flex, Image, useColorMode, Button } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { IoHomeOutline } from "react-icons/io5";import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router";
import { MdLogout } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { IoChatbubbleOutline } from "react-icons/io5";
const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);

    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>
            {user && (
                <Link as={RouterLink} to="/">
                    <IoHomeOutline size={24} />
                </Link>
            )}
            {!user && (
                <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
                    Login
                </Link>
            )}

            <Image
                cursor={"pointer"}
                alt="logo"
                w={6}
                src={
                    colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"
                }
                onClick={toggleColorMode}
            />

            {user && (
                <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link>
                    <Link as={RouterLink} to={`/chat`}>
                        <IoChatbubbleOutline size={24} />
                    </Link>
                    <Button size={"xs"} onClick={logout}>
                        <MdLogout size={20} />
                    </Button>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
                    Sign up
                </Link>
            )}
        </Flex>
    );
};

export default Header;

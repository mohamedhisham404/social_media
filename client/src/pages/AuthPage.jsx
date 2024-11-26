import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom"
import SignupCard from "../components/signupCard"
import LoginCard from "../components/LoginCard"
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <>
            {authScreenState === "login" ? <LoginCard/> :<SignupCard/>}
        </>
    )
}

export default AuthPage
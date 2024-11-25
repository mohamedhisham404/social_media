import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom"
import SignupCard from "../components/signupCard"
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <div>
            <SignupCard/>
        </div>
    )
}

export default AuthPage
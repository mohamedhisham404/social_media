import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

    const logout =async()=>{
        try{
            const res = await fetch("/api/users/logout",{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              const data = await res.json();

              if(data.status=="error" || data.status === "faile"){
                showToast("",data.data,"error");
                return;
              }

            localStorage.removeItem("user-threads");
            setUser(null);  
        }catch(error){
            showToast("",error,"error");   
        }
    }

	return logout;
};

export default useLogout;
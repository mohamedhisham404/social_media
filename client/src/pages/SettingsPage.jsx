import { Button, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
	const toast = useToast();
	const logout = useLogout();

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();

			if (data.error) {
                toast({
                    description: data.error || "An error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
				return ;
			}
			if (data.success) {
				await logout();
                toast({
                    description:"Your account has been frozen",
                    status: "Success",
                    duration: 5000,
                    isClosable: true,
                });
			}
		} catch (error) {
			toast({
                description: error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
		}
	};

	return (
		<>
			<Text my={1} fontWeight={"bold"}>
				Freeze Your Account
			</Text>
			<Text my={1}>You can unfreeze your account anytime by logging in.</Text>
			<Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};
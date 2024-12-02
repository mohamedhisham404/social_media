export const deletePost = async (postId, toast) => {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
        });

        let data;
        try {
            data = await response.json();
        } catch {
            if (response.status === 204) {
                data = { status: "success" };
            } else {
                throw new Error("Unexpected response format");
            }
        }

        if (data.status === "error" || data.status === "fail") {
            toast({
                description: data.data || "An error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        toast({
            description: "Post deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        toast({
            description: error.message || "An error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};

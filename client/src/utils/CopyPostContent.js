export const copyPostContent = (postText, toast) => {
    navigator.clipboard.writeText(postText).then(() => {
        toast({
            status: "success",
            description: "Post Content copied.",
            duration: 3000,
            isClosable: true,
        });
    });
};
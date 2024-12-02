import { Menu, MenuButton, MenuList, MenuItem, Portal } from "@chakra-ui/react";
import { CiMenuKebab } from "react-icons/ci";
import { copyPostContent } from "../utils/CopyPostContent";
import { deletePost } from "../utils/DeletePost";
import { useNavigate } from "react-router";

const PostMenu = ({ post, user, currrentuser, toast, navigation }) => {
    const navigate = useNavigate();

    const CopyPostContent = () => {
        copyPostContent(post.text, toast);
    };

    const handleDeletePost = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        await deletePost(post._id, toast);
        navigate(navigation);
    };

    return (
        <Menu>
            <MenuButton onClick={(e) => e.stopPropagation()}>
                <CiMenuKebab size={24} cursor={"pointer"} />
            </MenuButton>
            <Portal>
                <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={CopyPostContent}>
                        Copy Post Content
                    </MenuItem>
                    {currrentuser?._id === user._id && (
                        <MenuItem bg={"gray.dark"} onClick={handleDeletePost}>
                            Delete Post
                        </MenuItem>
                    )}
                </MenuList>
            </Portal>
        </Menu>
    );
};

export default PostMenu;

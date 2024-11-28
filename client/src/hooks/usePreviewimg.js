import { useState } from 'react'
import { useToast } from "@chakra-ui/react";

const usePreviewimg = () => {
    const [imgUrl,setImageUrl] =useState(null);
    const toast = useToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);

        } else {
            toast({
                title: "Avatar update failed",
                description: "Invalid file type.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }
    
  return {
    handleImageChange,
    imgUrl,
    setImageUrl
  }
}

export default usePreviewimg
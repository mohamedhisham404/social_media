import {Button,Flex} from '@chakra-ui/react';
import { Link } from 'react-router';

const HomePage = () => {
  return (
    <Link to={"/mohamedhisham"}>
        <Flex w={"full"} justifyContent={"center"}>
            <Button mx={"auto"}>Visit Profile</Button>
        </Flex>
    </Link>
  )
}

export default HomePage
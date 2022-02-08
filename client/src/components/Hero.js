import React from 'react';
import {  Text, Box, useColorModeValue, Link } from '@chakra-ui/react';
import Signature from './Signature';

const Hero = () => {

    const styleProps = {
        mainText: {
            fontSize: "8xl",
            fontWeight: "bold",
            textAlign: "right",
            lineHeight: "none",
            fontFamily: "heading"
        },
        subText: {
            as: "h4",
            fontSize: '2xl',
            textAlign: "right",
        },
        subTextLink: {
            fontWeight: "bold",
            isExternal: true,
            color: useColorModeValue("primaryLight", "primaryDark")
        }
    }
    
    return (
        <Box minH="100vh" position="relative" >
            <Box marginTop="10vh" zIndex={10} >
                <Text {...styleProps.mainText} as="h1">Hello <Text as="span" fontSize="7xl">👋🏽</Text><br />I'm <Text color={useColorModeValue("primaryLight", "primaryDark")} as="span">Ammar</Text></Text>
                <Text {...styleProps.subText}>Engineering student at the <Link href="https://uwaterloo.ca/" {...styleProps.subTextLink}>University of Waterloo</Link></Text>
                <Text {...styleProps.subText}>QA Engineer at <Link href="https://hire.company" {...styleProps.subTextLink}>HIRE Technologies</Link></Text>
            </Box>
            <Signature color={useColorModeValue("black", "white")}/>
        </Box>
    );
}

export default Hero;

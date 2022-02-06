import React from "react";
import {
  Flex,
  Icon,
  Spacer,
  Box,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Link
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Logo from "./Logo";
import Resume from "../assets/documents/Ammar_Resume_Sep_2021.pdf"

const LogoIcon = (props) => {
  return (
    <Icon {...props} viewBox="0 0 602 328">
      <Logo color1={useColorModeValue("#A10010", "#9c414a")} color2="transparent" strokeWidth={8} />
    </Icon>
  );
};

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const styleProps = {
    main: {
      p: 4,
      position: "fixed",
      w: "100%",
      bg: useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)"),
      top: 0,
      backdropFilter: "saturate(180%) blur(5px)",
      borderTop: "solid 2vh",
      borderColor: useColorModeValue("primaryLight", "primaryDark"),
      align: "center",
      justify: "space-between",
      zIndex: 200,
    },
    navButton: {
      colorScheme: "blackAlpha",
      color: useColorModeValue("black", "white"),
      variant: "ghost",
      fontWeight: "bold",
      fontFamily: "body",
      fontSize: "xl",
    },
    iconLink: {
        mr: 2,
        _hover: {
            color: "gray.500"
        }
    },
    colorModeToggle: {
      size: "sm",
      variant: "ghost",
      colorScheme: "blackAlpha",
      color: useColorModeValue("black", "white"),
    },
  };

  return (
    <Flex as="header" {...styleProps.main}>
      <Box>
        <LogoIcon boxSize={20} />
      </Box>
      <Spacer />
      <Flex align="center">
        <Button {...styleProps.navButton}>About</Button>
        <Button {...styleProps.navButton}>Projects</Button>
        <Button {...styleProps.navButton}>Experience</Button>
      </Flex>
      <Spacer />
      <Flex align="center">
        <Link href="https://github.com/ammar-ahmed22" isExternal {...styleProps.iconLink}>
            <FontAwesomeIcon icon={['fab', "github"]}/>
        </Link>
        <Link href="https://www.linkedin.com/in/ammarahmed03/" isExternal {...styleProps.iconLink}>
            <FontAwesomeIcon icon={['fab', "linkedin"]}/>
        </Link>
        <Link href={Resume} {...styleProps.iconLink} isExternal >
            <FontAwesomeIcon icon="file-download"/>
        </Link>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          {...styleProps.colorModeToggle}
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default NavBar;

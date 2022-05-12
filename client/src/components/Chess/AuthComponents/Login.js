import React, { useState, useEffect } from 'react';
import NavBar from '../../NavBar';
import PageContent from '../../PageContent';
import Footer from '../../Footer';
import { Flex, Text, FormControl, Input, InputRightElement, InputGroup, Button, Link, Box, Alert, AlertIcon, CloseButton, useColorModeValue, Image, Spinner } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as ReactLink, Redirect } from "react-router-dom";
import { useMutation, gql } from '@apollo/client';
import { useAuthToken } from '../../../hooks/authToken';
import { useGoogleLogin } from "react-google-login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GLogo from "../../../assets/images/g-logo.png";
import GLogoLight from "../../../assets/images/google_signin_buttons/ios/2x/btn_google_light_normal_ios@2x.png";
import GLogoDark from "../../../assets/images/google_signin_buttons/ios/2x/btn_google_dark_normal_ios@2x.png";
import GoogleButton from "react-google-button";

const GoogleClientID = "137764403028-edju7i0l6f6j0mj9inc4t41m81njc3sc.apps.googleusercontent.com";

const Login = () => {

    const LOGIN_MUT = gql`
        mutation Login($email: String!, $password: String!){
            login(email: $email, password: $password){
                token
                message
            }
        }
    `

    const GOOGLE_LOGIN = gql`
        mutation loginGoogle(
            $email: String!,
            $firstName: String!,
            $lastName: String!,
            $googleToken: String!
        ){
            loginGoogle(
                email: $email,
                firstName: $firstName,
                lastName: $lastName,
                googleToken: $googleToken
            ){
                token
                message
            }
        }
    `

    const primary = useColorModeValue("primaryLight", "primaryDark");

    const styleProps = {
        main: {
            align: "center",
            justify: "center",
            direction: "column",
            mt: "10vh",
            //width: "50%"
        },
        hello: {
            fontSize: "4xl",
            fontWeight: "bold",
            fontFamily: "heading"
        },
        loginBtn: {
            width: "100%",
            my: 3,
            bg: primary,
            color: "white",
            colorScheme: "red",
        },
        forgotPass: {
            color: primary,
            fontSize: "sm",
            textAlign: "end",
            width: "100%",
        },
        alert: {
            status: "error",
            fontSize: "sm",
            borderRadius: "md",
            mb: 2
        }
    }

    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [authToken, setAuthToken] = useAuthToken();

    const [ attemptLogin, { data, loading, error }] = useMutation(
        LOGIN_MUT,
        {
            onCompleted: (data) => {
                data && setAuthToken(data.login.token);
            },
            errorPolicy: "all"
        }
    );

    const [ loginGoogle, { data: googleData, loading: googleLoading, error: googleError } ] = useMutation(GOOGLE_LOGIN, {
        onCompleted: (data) => {
            console.log("GOOGLE QUERY BEING SENT");
            data && setAuthToken(data.loginGoogle.token)
        },
        errorPolicy: "all"
    })

    const onSuccess = res => {
        console.log("Login success, currentUser:", res.profileObj);
        console.log("Login success, res:", res);
        console.log("Login success, tokenObj", res.tokenObj.id_token);

        const { email, givenName: firstName, familyName: lastName } = res.profileObj;
        const { id_token: googleToken } = res.tokenObj;
        

        loginGoogle({
            variables: {
                email,
                firstName: firstName ? firstName : "",
                lastName: lastName ? lastName : "",
                googleToken
            }
        })

    }

    const onFailure = res => {
        console.log("Login failed, res:", res.details);
    }

    const { signIn: googleSignIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId: GoogleClientID,
        isSignedIn: true,
        accessType: "offline"
    });

    const handleLogin = async e => {
        e.preventDefault();
        console.log(email, password)
        attemptLogin({
            variables: {
                email: email,
                password: password,
            },
            errorPolicy: "all"
        })

    }

    useEffect(() => {
        if (error){
            setErrorMessage(error.message);
        }
    }, [error])

    useEffect(() => {
        
        if (googleData){
            console.log(googleData);
        }

        if (googleError){
            console.log(googleError);
        }

    }, [googleData, googleError])

    const ORColor = useColorModeValue("gray.600", "gray.200");
    
    
    return (
        <>
            <NavBar active="chess"/>
            <PageContent>
                <Flex {...styleProps.main}>
                    {
                        !googleLoading && (
                            <>
                                <Text {...styleProps.hello}>Hello!</Text>
                                <Text>Login to continue our game.</Text>
                                <Box width="50%" mt="2">
                                    <FormControl isRequired >
                                        <InputGroup mb="2">
                                            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                                            <InputRightElement children={<Text color="gray.300">@</Text>}/>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl isRequired >
                                        <InputGroup >
                                            <Input type={showPass ? "text" : "password"} value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                                            <InputRightElement>
                                                <Button variant="ghost" color="gray.300" onClick={e => setShowPass(!showPass)}>
                                                    {
                                                        showPass ? <ViewOffIcon /> : <ViewIcon />
                                                    }
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        <Box display="flex" justifyContent="end" my="2">
                                            <Link {...styleProps.forgotPass} to="/chess/forgotpassword"  as={ReactLink} >Forgot password?</Link>
                                        </Box>
                                        
                                        <Button {...styleProps.loginBtn} onClick={handleLogin} isLoading={loading && !error} >Sign in</Button>
                                        

                                        <Flex justify="center" align="center" mb="3" >
                                            <Box height="1px" bg="gray.400" w="100%"/>
                                            <Text mx="2" fontSize="smaller" color={ORColor} >OR</Text>
                                            <Box height="1px" bg="gray.400" w="100%"/>
                                        </Flex>
                    
                                        <GoogleButton type="dark" style={{width: "100%", marginBottom: "0.75rem"}} onClick={googleSignIn} />
                                        
                                        
                                        
                                        {
                                            errorMessage && (
                                            <Alert {...styleProps.alert} >
                                                <AlertIcon />
                                                {errorMessage}
                                                <CloseButton position="absolute" top="8px" right="8px" onClick={() => setErrorMessage("")}/>
                                            </Alert>
                                        )
                                        }
                                        
                                        <Text fontSize="sm" color="gray.500" textAlign="center" >Don't have an account yet? <Link as={ReactLink} to="/chess/register" color={primary} >Sign up</Link> </Text>
                                        
                                        
                                    </FormControl>
                                </Box>
                            </>
                        )
                    }
                    {
                        googleLoading && (
                            <Spinner emptyColor='gray.200' thickness='8px' size="xl" color={primary} speed="0.65s" />
                        )
                    }

                    {
                        data && authToken && (
                            <Redirect to={"/chess/secure"} />
                        )
                    }
                    {
                        googleData && googleData.loginGoogle.message === "Google user logged in" && authToken && (
                            <Redirect to={"/chess/secure"} />
                        )
                    }
                    {
                        googleData && googleData.loginGoogle.message === "Complete profile for new Google user" && authToken && (
                            <Redirect to="/chess/secure/completeprofile" />
                        )
                    }
                </Flex>
            </PageContent>
            <Footer />
        </>
    );
}

export default Login;

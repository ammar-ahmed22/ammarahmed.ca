import React, { useContext, useEffect } from 'react';
import NavBar from '../../NavBar';
import PageContent from '../../PageContent';
import Footer from '../../Footer';
import { Box, Text, Button } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import { useAuthToken } from '../../../hooks/authToken';
import { useApolloClient } from '@apollo/client';
import { useGoogleLogout } from 'react-google-login';

const GoogleClientID = "137764403028-edju7i0l6f6j0mj9inc4t41m81njc3sc.apps.googleusercontent.com";

const Play = ({ history }) => {


    const GET_PLAYER = gql`
        query{
            getPlayer{
                _id
                name{
                    first
                    last
                }
                email
                company
                position
                foundFrom
                isGoogle
            }
        }
    `

    
    const [authToken, setAuthToken, removeAuthToken] = useAuthToken();
    const apolloClient = useApolloClient();

    const { data, loading, error } = useQuery(GET_PLAYER)

    useEffect(() => {
        if (data){
            console.log(data)
        }
    }, [ data])

    const onLogoutSuccess = (res) => {
        console.log("Google user logged out");
    }

    const onFailure = () => {
        console.log("Google user log out failed");
    }

    const { signOut } = useGoogleLogout({
        clientId: GoogleClientID,
        onLogoutSuccess,
        onFailure
    })

    const handleLogout = e => {
        
        apolloClient.clearStore();
        removeAuthToken();

        if (data && data.getPlayer.isGoogle){
            signOut();
        }
        
        history.push("/chess/logout");
    }
    
    return (
        <>
            <NavBar active="chess"/>
            <PageContent>
                <Box mt="10vh">
                    <Text>LOGGED IN PAGE</Text>
                    {
                         data && (
                             <>
                                <Text>Name: {data.getPlayer.name.first} {data.getPlayer.name.last}</Text>
                                <Text>Email: {data.getPlayer.email}</Text>
                                <Text>Company: {data.getPlayer.company}</Text>
                                <Text>Position: {data.getPlayer.position}</Text>
                                <Text>Google User: {data.getPlayer.isGoogle.toString()}</Text>
                             </>
                         )
                    }
                    <Button onClick={handleLogout}>Logout</Button>
                </Box>
            </PageContent>
            <Footer />
        </>
    );
}

export default Play;

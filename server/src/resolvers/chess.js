import Player from "../models/Player";
import Game from "../models/Game";
import { UserInputError } from "apollo-server-express";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import readContent from "../utils/readContent";
import { getPathPrefix } from "../utils/helpers";
import { OAuth2Client } from "google-auth-library";
import verifyGoogleUser from "../utils/verifyGoogleUser";
import { createPlayerWithGame } from "../utils/playerFactory";

// RENAME EVERYTHING WITH OPP TO PLAYER

const chessQueries = {
        getAllPlayers: async () => {
            const players = await Player.find({});

            if (players.length){
                return players;
            }else{
                throw new UserInputError("No opponents found")
            }
        },
        getPlayerById: async (_, { id }) => {
            const opp = await Player.findById(id);

            if (opp){
                return opp
            }else{
                throw new UserInputError("No opponent found with id", { id })
            }
        },
        getGame: async (_, { gameID }) => {
            const game = await Game.findById(gameID);

            if (!game){
                throw new UserInputError("No game found with id", { gameID });
            }

            return game;
        },
        testAuth: (_, args, { auth }) => {
            console.log(auth);

            return "testing auth"
        },
        getPlayer: async (_, args, { auth: { id }}) => {
            const player = await Player.findById(id);
            
            return player;
        },
        testGoogle: async (_, { tokenId }, auth) => {
            //console.log(auth);
            // const client = new OAuth2Client("137764403028-edju7i0l6f6j0mj9inc4t41m81njc3sc.apps.googleusercontent.com");

            // const ticket = await client.verifyIdToken({
            //     idToken: tokenId,
            //     audience: "137764403028-edju7i0l6f6j0mj9inc4t41m81njc3sc.apps.googleusercontent.com"
            // });

            // const payload = ticket.getPayload();

            // const userId = payload.sub;
            const res = await verifyGoogleUser(tokenId);

            if (res.error){
                throw new UserInputError("Google tokenId cannot be verified");
            }




            return res.userID;
        }
    }
const chessMutations = {
        register: async (_, { firstName, lastName, email, password }) => {

            const existingPlayer = await Player.findOne({ email })

            if (existingPlayer){
                console.log(`PLAYER WITH EMAIL: ${email} ALREADY EXISTS`)
                console.log(existingPlayer)
                throw new UserInputError("Player with email already exists", {
                    email
                })
            }

            const name = {
                first: firstName,
                last: lastName,
            }

            const { player } = await createPlayerWithGame({ email, password, name });

            return {token: player.getSignedJWT(), message: "Player created!"};
            
        },
        registerGoogle: async (_, { email, firstName, lastName, googleToken }) => {
            
            const res = await verifyGoogleUser(googleToken);
            //console.log(res);

            if (res.error){
                throw new UserInputError("Google token could not be verified")
            }

            const existingPlayer = await Player.findOne({ email });

            if (existingPlayer){
                if (existingPlayer.isGoogle){
                    // handle this case
                    return { token: existingPlayer.getSignedJWT(), message: "Google user already exists" }
                }

                throw new UserInputError("Player with email already exists", { email });
            }

            const name = {
                first: firstName,
                last: lastName,
            }

            const { player } = await createPlayerWithGame({ name, email, isGoogle: true, password: res.userID });

            return { token: player.getSignedJWT(), message: "Google user created!" };

        },
        loginGoogle: async (_, { email, googleToken, firstName, lastName }) => {
            const res = await verifyGoogleUser(googleToken);

            if (res.error){
                throw new UserInputError("Google token could not be verified");
            }

            const player = await Player.findOne({ email, isGoogle: true });

            if (player){
                return { token: player.getSignedJWT(), message: "Google user logged in" }
            }else{
                const { player: newPlayer } = await createPlayerWithGame({
                    name:{
                        first: firstName,
                        last: lastName
                    },
                    password: res.userID,
                    name: {
                        first: firstName,
                        last: lastName
                    },
                    email,
                    isGoogle: true
                })

                if (newPlayer){
                    return { token: newPlayer.getSignedJWT(), message: "Complete profile for new Google user" }
                }
            }
        },
        completeProfile: async (_, { company, position, foundFrom }, { auth: { id } }) => {
            const player = await Player.findById(id);

            player.company = company;
            player.position = position;
            player.foundFrom = foundFrom;

            await player.save();

            return { token: player.getSignedJWT(), message: "Player profile updated." }
        },
        addMove: async (_, { gameID, fen }) => {
            const game = await Game.findById(gameID);

            if (!game){
                throw new UserInputError("No game found with id", { gameID })
            }

            game.moves.push({ fen, playedAt: new Date()})

            await game.save();

            return game
        },
        login: async (_, { email, password }) => {
            const player = await Player.findOne({ email }).select("+password");

            if (!player){
                throw new UserInputError("User not found")
            }

            const isMatched = await player.matchPasswords(password);

            if (!isMatched){
                throw new UserInputError("Invalid credentials");
            }

            return {token: player.getSignedJWT(), message: "Logged in!"};
        },
        forgotPassword: async (_, { email }) => {
            const player = await Player.findOne({ email });

            if (!player){
                throw new UserInputError("No player found!", { email })
            }

            const resetToken = await player.getResetPasswordToken();

            await player.save();

            try {
                const resetLink = `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ammarahmed.ca"}/chess/resetpassword?token=${resetToken}`
                const emailHTML = readContent(`${getPathPrefix(process.env.NODE_ENV)}emails/resetPassword.html`).replace("RESET_LINK", resetLink);
                
                
                await sendEmail({ to: email, subject: "Reset password for ammarahmed.ca", html: emailHTML});
            } catch (error) {
                player.resetPasswordToken = undefined;
                player.resetPasswordExpire = undefined;

                await player.save();

                console.log(error)
                throw new UserInputError("Error sending email")
            }
            
            return resetToken;

        },
        resetPassword: async (_, { newPassword, resetToken }) => {
            const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

            const player = await Player.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            })

            if (!player){
                throw new UserInputError("Invalid reset token")
            }

            console.log(player)
            player.password = newPassword;
            player.resetPasswordToken = undefined;
            player.resetPasswordExpire = undefined;

            await player.save();

            return "Success"
        }
    }
    


export { chessQueries, chessMutations };
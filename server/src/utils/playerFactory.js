import Player from "../models/Player";
import Game from "../models/Game";



export const createPlayerWithGame = async ({ email, password=null, name, isGoogle=false }) => {
    let game;

    console.log("CREATE PLAYER WITH GAME, password:", password);

    const player = await Player.create({
        name,
        email,
        password,
        isGoogle,
        signedupAt: new Date(),
        currentGameID: null,
        permissions: ["read:own_user", "write:own_user"],
        gameHistory: [],
        allGameIDs: [],
    })

    if (player){
        game = await Game.create({
            playerID: player.id,
            moves: [{fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', playedAt: null}],
            playerToMove: true,
            playerWon: false,
            tied: false
        })

        if (game){
            player.currentGameID = game.id;
            player.allGameIDs.push(game.id);
            await player.save();
        }
    }

    return {
        player,
        game
    }

}



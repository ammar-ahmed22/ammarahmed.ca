import React, { useEffect, useState } from 'react';
import Piece from './Piece';
import { Text, Box, useColorModeValue } from "@chakra-ui/react"
import FENParser from './utils/FENParser';

const SquareIdentifier = ({ type, identifier }) => {
    const styles = {
        shared: {
            position: "absolute",
            padding: "0.25em",
            margin: 0
        },
        file: {
            bottom: "-100%",
            transform: "translate(0, -50%)",
            right: 0,
        },
        rank: {
            top: 0,
            left: "0",
            transform: "translate(-150%, 0)"
        }
    }


    switch (type) {
        case "file":
            return <Text {...styles.file} {...styles.shared} >{identifier}</Text>
            break;
        case "rank":
            return <Text {...styles.rank} {...styles.shared} >{identifier}</Text>
            break
        default:
            break;
    }
    
}

const MoveIdentifier = () => {

    const styles = {
        main: {
            position: "absolute",
            top: "50%",
            left: '50%',
            transform: "translate(-50%, -50%)",
            height: '100%',
            width: '100%',
            bg: "rgba(255, 255, 153, .25)",
            zIndex: 1000
        }
    }

    return (
        <Box {...styles.main} />
    )
}

const Square = ({ rank, file, size, pieceID, boardLayout, setBoardLayout, setFen, boardIndices, pieceClicked, setPieceClicked, showMoveIdentifier, isFirstMove }) => {

    const primary = useColorModeValue("primaryLight", "primaryDark");


    const styles = {
        square: {
            bg: (boardIndices.rank + boardIndices.file ) % 2 === 0 ? primary : "gray.200",
            width: size,
            height: size,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // borderLeft: boardIndices.file === 0 ? "solid 1px" : "",
            // borderRight: boardIndices.file === 7 ? "solid 1px" : "",
            // borderTop: boardIndices.rank === 0 ? "solid 1px" : "",
            // borderBottom: boardIndices.rank === 7 ? "solid 1px" : "",
            // borderColor: "transparent"
        }
    }

    const [pieceParams, setPieceParams] = useState({});
    

    useEffect(() => {

        const parsePieceID = (pieceID) => {
            let piece;
            let color;
            
            color = pieceID !== pieceID.toLowerCase() ? "white" : "black"

            switch (pieceID.toLowerCase()) {
                case "r":
                    piece = "rook"
                    break;
                case "n":
                    piece = "knight"
                    break;
                case "b":
                    piece = "bishop"
                    break
                case "q":
                    piece = "queen"
                    break;
                case "k":
                    piece = 'king'
                    break;
                case "p":
                    piece = "pawn"
                    break;
                default:
                    break;
            }
            
            return {
                piece,
                color
            }
        }

        if (pieceID){
            setPieceParams(parsePieceID(pieceID))
            
        }else{
            setPieceParams({})
        }


    }, [pieceID, showMoveIdentifier])

    const handleDragOver = e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move';
    }

    const updateFENonMove = (prevFen, removePiece, addPiece) => {
        const parser = new FENParser(prevFen);
        const openingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const prevLayout = parser.squaresFromFEN();

        addPiece.piece = prevLayout[removePiece.rank][removePiece.file]

        const newLayout = [...prevLayout];
        newLayout[removePiece.rank][removePiece.file] = false;
        newLayout[addPiece.rank][addPiece.file] = addPiece.piece;

        const newColorToMove = parser.colorToMove === "w" ? "b" : "w";

        const prevFullMoveCount = parser.fullMoveCount;
        let newFullMoveCount = prevFullMoveCount;
        
        if (parser.colorToMove === "b" && prevFen !== openingFEN){
            newFullMoveCount = parseInt(prevFullMoveCount) + 1;
        }
        
        

        return parser.fenFromSquares(newLayout, { colorToMove: newColorToMove, fullMoveCount: newFullMoveCount })

    }

    const handleDrop = e => {
        e.preventDefault()

        // data sent from piece being dragged
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));

        
        // Checking if drop is a valid move
        let invalid = true
        data.validMoves.forEach( move => {
            
            if (move.rank == boardIndices.rank && move.file == boardIndices.file){
                invalid = false
            }
        })

        if (invalid){
            e.dataTransfer.effectAllowed = "none"
        }else{
            e.dataTransfer.effectAllowed = "all"
            setFen( prevFen => {
                
                const removePiece = { rank: data.rank, file: data.file }
                const addPiece = { rank: boardIndices.rank, file: boardIndices.file }

                return updateFENonMove(prevFen, removePiece, addPiece)

                
            })
            
        }
        

        
    }

    const handleClick = e => {
        if (showMoveIdentifier && Object.keys(pieceClicked).length > 0){

            setFen( prevFen => {
                const removePiece = pieceClicked.clickedPiece;
                const addPiece = { rank: boardIndices.rank, file: boardIndices.file };

                return updateFENonMove(prevFen, removePiece, addPiece)
            })

            

            setPieceClicked({})
        }

        if (!showMoveIdentifier && Object.keys(pieceClicked).length > 0){
            setPieceClicked({})
        }
    }

    return (
        <Box className='square' {...styles.square} onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
            {
                boardIndices.file === 0 && <SquareIdentifier type="rank" identifier={rank}/>
            }
            {
                boardIndices.rank === 7 && <SquareIdentifier type="file" identifier={file}/>
            }
            {
                showMoveIdentifier && <MoveIdentifier />
            }
            {Object.keys(pieceParams).length > 0 && <Piece color={pieceParams.color} piece={pieceParams.piece} setPieceClicked={setPieceClicked} boardLayout={boardLayout} setBoardLayout={setBoardLayout} rank={rank} file={file} boardIndices={boardIndices}/>}
        </Box>
    );
}

export default Square;

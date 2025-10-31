import '../styles/PlayPage.css'
import {useEffect, useState} from "react";

function GameInstance( {chars, setChars} ) {

    return (
        <div id="game-instance">

        </div>
    )
}

function PlayGame() {

    const [ongoing, setOngoing]= useState(false);
    const [code, setCode] = useState("");
    const [animeIDs, setAnimeIDs] = useState([]);
    const [chars, setChars] = useState([]);

    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const base = alphabet.length;

    const shuffleChars = () => {
        setChars(prevChars => [...prevChars].sort(() => Math.random() - 0.5))
        console.log(chars);
    }

    const decodeString = (encoded) => {
        const chunks = encoded.split("-");
        const result = [];

        for (const chunk of chunks) {
            if (!chunk) continue;

            let num = 0;
            for (let i = 0; i < chunk.length; i++) {
                const idx = alphabet.indexOf(chunk[i]);
                if (idx === -1) {
                    throw new Error(`Invalid character "${chunk[i]}" in chunk "${chunk}"`);
                }
                num = num * base + idx;
            }
            result.push(num.toString().padStart(5, "0"));
        }

        console.log(result);
        setAnimeIDs(result);
    };


    const handleDecode = () => {
        decodeString(code);
        setOngoing(true);
        shuffleChars();
    };

    useEffect(() => {
        if (animeIDs.length === 0) return;

        setChars([]);

        const numOfIDs = animeIDs.length;

        async function fetchCharacters(id) {
            const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
            const data = await res.json();
            const sorted = data.data.sort((a, b) => b.favorites - a.favorites);

            return sorted.slice(0, 24 / numOfIDs).map((item) => {
                const nameParts = item.character.name.split(", ");
                const properName =
                    nameParts.length === 2 ? `${nameParts[1]} ${nameParts[0]}` : item.character.name;

                return {
                    id: item.character.mal_id,
                    name: properName,
                    img: item.character.images.jpg.image_url,
                    favorites: item.favorites
                };
            });
        }

        Promise.all(animeIDs.map(fetchCharacters)).then((results) => {
            const combined = results.flat();
            const shuffled = [...combined].sort(() => Math.random() - 0.5);
            setChars(shuffled);
            console.log("✅ Shuffled chars:", shuffled);
        });
    }, [animeIDs]);


    return (
        <div id="playpage">
            <div id="play-header">
                <img src="" alt="logo" />
            </div>
            <div id="playpage-main">
                {!ongoing &&
                    <div id="enter-code-div">
                        <p>Enter a code to start playing!</p>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleDecode();
                            }}
                        />
                    </div>
                }
                {ongoing &&
                    <GameInstance chars={chars} setChars={setChars}/>
                }
            </div>
        </div>
    )
}

export default PlayGame;
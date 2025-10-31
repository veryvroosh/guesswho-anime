import {Link} from "react-router";
import '../styles/CreatePage.css';
import {useEffect, useState} from "react";

function Search( {searchParams, setSearchParams, setFetchFlag} ) {
    return (
        <input
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === "Enter") {
                    setFetchFlag(true);
                }
            }}
        />
    )
}

function AnimeCard( {handleSelect, title, img} ) {
    return (
        <div className="anime-card">
            <div className="anime-name-img">
                <img src={img}/>
                <div>{title}</div>
            </div>
            <button onClick={handleSelect}>Add</button>
        </div>
    )
}

function SelectedCard( {anime} ) {
    return (
        <div className="selected-card">
            {anime.title}
        </div>
    )
}

function CreateGame() {

    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchParams, setSearchParams] = useState("");
    const [fetchFlag, setFetchFlag] = useState(false);
    const [code, setCode] = useState("");

    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const base = alphabet.length;

    const encodeNumber = (num) => {
        let str = "";
        while (num > 0) {
            str = alphabet[num % base] + str;
            num = Math.floor(num / base);
        }
        return str || "0";
    }

    useEffect(() => {
        if(!fetchFlag) return;
        async function fetchSearch() {
            try {
                setResults([]);
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${searchParams}&order_by=scored_by&sort=desc`)
                const data = await res.json();
                const sorted = data.data.sort((a, b) => b.favorites - a.favorites);
                const top8 = sorted.slice(0, 8).map((item) => {
                    let modID = item.mal_id.toString().padStart(5, "0");
                    return {
                        id: modID,
                        title: item.title_english || item.title,
                        img: item.images.jpg.image_url
                    };
                });
                console.log(top8)
                setResults(top8);
            } catch(err) {
                console.error("error fetching data:", err)
            } finally {
                setFetchFlag(false);
            }
        }
        void fetchSearch();
    }, [fetchFlag]);

    const handleSelect = (result) => {
        setSelected(prev => [...prev, result]);
    }

    const handleCodeCreation = () => {
        const encodedParts = selected.map(result => encodeNumber(parseInt(result.id)));
        const code = encodedParts.join("-");
        setCode(code);
    };

    return (
        <div id={"createpage"}>
            <div id="create-header">
                <img src="" alt="logo" />
                <Search
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    setFetchFlag={setFetchFlag}
                />
            </div>
            <div id="search-results">
                {results.length === 0
                    ? "Please search for an anime"
                    : results.map(result =>
                        <AnimeCard
                            key={result.id}
                            handleSelect={() => handleSelect(result)}
                            title={result.title}
                            img={result.img}
                        />)
                }
            </div>
            <div id="selected-animes">
                <div id="selected-div">
                    {selected.length === 0
                        ? "Please select at least 1 anime"
                        : selected.map(result => <SelectedCard key={result.id} anime={result}/>)
                    }
                </div>
                <div id="create-code-div">
                    <button onClick={handleCodeCreation}>Generate Code</button>
                    <p>
                        {code.length === 0
                            ? ""
                            : code
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CreateGame;
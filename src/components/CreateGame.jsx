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

function AnimeCard( {title, img} ) {
    return (
        <div>
            <img src={img} />
            <p>{title}</p>
        </div>
    )
}

function CreateGame() {

    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchParams, setSearchParams] = useState("");
    const [fetchFlag, setFetchFlag] = useState(false);

    useEffect(() => {
        if(!fetchFlag) return;
        async function fetchSearch() {
            try {
                setResults([]);
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${searchParams}&order_by=scored_by&sort=desc`)
                const data = await res.json();
                const sorted = data.data.sort((a, b) => b.favorites - a.favorites);
                const top8 = sorted.slice(0, 8).map((item) => {
                    return {
                        id: item.mal_id,
                        title: item.title_english,
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
                    : results.map(result => <AnimeCard key={result.id} title={result.title} img={result.img}/>)
                }
            </div>
            <div id="selected-animes">

            </div>
        </div>
    )
}

export default CreateGame;
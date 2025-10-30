import {Link} from "react-router";
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

function CreateGame() {

    const [animes, setAnimes] = useState([]);
    const [searchParams, setSearchParams] = useState("");
    const [fetchFlag, setFetchFlag] = useState(false);

    useEffect(() => {
        if(!fetchFlag) return;
        async function fetchSearch() {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${searchParams}&order_by=scored_by&sort=desc`)
                const data = await res.json();
                console.log(data);
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
            <Search
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                setFetchFlag={setFetchFlag}
            />
        </div>
    )
}

export default CreateGame;
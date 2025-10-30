import {Link} from "react-router";

function Home() {
    return (
        <div id={"homepage"}>
            <img src="" alt="logo" />
            <Link to="/create">
                <button>Create Game</button>
            </Link>
            <Link to="/play">
                <button>Play</button>
            </Link>
        </div>
    )
}

export default Home;
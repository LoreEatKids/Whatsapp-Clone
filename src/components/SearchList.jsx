import "./styles/searchlist.scss";

export default function SearchList({ results, err, active }) {
    console.log(results);
    
    return (
        <main className={`searchlist ${active}`}>
            <h1>List</h1>
        </main>
    )
};

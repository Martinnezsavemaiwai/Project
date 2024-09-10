import './SearchBox.css'

const SearchBox: React.FC = () => {
    return(       
        <div className="search-bar">
                <input type="text" placeholder="Search" aria-label="Search" />
                <a href="#" className="img-box">
                    <img src="/images/icon/search.png" alt="Search icon" />
                </a>
        </div>
    )
}

export default SearchBox;

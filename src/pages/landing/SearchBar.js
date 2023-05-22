const SearchBar = ({text, handleInput, validationError}) => {
    return (
        <div className='search-bar'>
            <input
                id='search-bar'
                className='search-bar'
                type='text' 
                role='search'
                placeholder='Search CV...'
                value={text}
                autoComplete='true'
                onChange={e => handleInput(e.target.value)}
            />
            {validationError ?
                <aside className='search-validation-text'>
                    <span>
                        {validationError}
                    </span>
                </aside>
            : null}
        </div>
    )
};

export default SearchBar;
const Sort = ({selectedSort, sortOptions, setSelectedSort}) => {
    return (
        <div className='sort-container'>
            <label htmlFor="sort">Sort by: </label>
            <select 
              name="sort" 
              id="sort"
              data-testid="sort-dropdown"
              className='sort-container-text'
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
            >
              {sortOptions.map(option => (
                <option 
                  value={option.name}
                  key={option.name}
                  role='option'
                >
                  {option.label}
                </option>
              ))}
            </select>
        </div>
    )
};

export default Sort;
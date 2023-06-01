import './components.css';

const Tag = ({children, i, testName, selected, handleClick}) => {

    return (
        <li 
            onClick={handleClick}
            className={`tag${selected ? ' selected' : ''}`}
            data-testid={testName}
            role="button" 
            aria-pressed={selected}
            tabIndex={i} 
        >
            {children}
        </li>
    );
};

export default Tag;
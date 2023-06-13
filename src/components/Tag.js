import './components.css';

const Tag = ({children, i, testName, selected, handleClick, disableHover}) => {

    return (
        <li 
            onClick={handleClick}
            className={`tag${selected ? ' selected' : ''}${disableHover ? ' hover-disable' : ''}`}
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
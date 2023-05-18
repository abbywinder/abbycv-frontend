import './components.css';
import { palette } from '../palette';


const Tag = ({children, i, testName, selected, handleClick}) => {

    return (
        <li 
            onClick={handleClick}
            className="tag"
            data-testid={testName}
            role="button" 
            aria-pressed={selected}
            tabIndex={i} 
            style={{
                backgroundColor: selected ? palette.selected : palette.deselected
            }}
        >
            <span>
                {children}
            </span>
        </li>
    );
};

export default Tag;
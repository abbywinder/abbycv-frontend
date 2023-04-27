import './components.css';
import { palette } from '../palette';


const Tag = ({children, i, testName}) => {

    return (
        <li 
            className="tag"
            tabIndex={i} 
            role="button" 
            data-testid={testName}
            aria-pressed="false"
            style={{
                backgroundColor: palette.accent
            }}
        >
            <span>
                {children}
            </span>
        </li>
    );
};

export default Tag;
const Prompt = ({ children, handleClick }) => {
    return (
        <div 
            className='prompt-container'
            onClick={() => handleClick(children)}
            data-testid='prompt'
        >
            <span>
                {children}
            </span>
        </div>
    )
};

export default Prompt;
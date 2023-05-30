const Message = ({ children, sender }) => {
    return (
        <div 
            className={`message-container ${sender}`}
            data-testid={`message-${sender}`}
        >
            <span>
                {children}
            </span>
        </div>
    )
};

export default Message;
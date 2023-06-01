
const ChatGPTDialogHead = ({ setDialogOpen }) => {

    return (
        <section className='dialog-head'>
            <img 
                src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/240px-ChatGPT_logo.svg.png'} 
                alt='ChatGPT logo'
                className='logo logo-open'
            />
            <h4>
                Ask ChatGPT
            </h4>
            <button 
                className='exit'
                aria-label='exit'
                onClick={() => setDialogOpen(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </section>
    );
};

export default ChatGPTDialogHead;
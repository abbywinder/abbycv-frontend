import '../App.css';

const LifestageButton = ({lifestage}) => {

    return (
        <a 
            className="button-container" 
            role="button"
            aria-label={lifestage.title}
        >
            <img 
                src='https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg' 
                className="button-img"
                alt={`Image of Abby in ${lifestage.date_start.slice(0,4)}`}
            />
            <h3>
                <span>
                    {lifestage.title}
                </span>
            </h3>
        </a>
    );
};

export default LifestageButton;
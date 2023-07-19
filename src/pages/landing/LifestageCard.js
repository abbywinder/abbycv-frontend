import Tag from '../../components/Tag';
import { Link } from 'react-router-dom';

const LifestageCard = ({lifestage}) => {

    const disableLink = lifestage.date_end < "2011-01-01T10:53:53.000Z";

    return (
        <li className='card-container'>
            <Link 
                to={!disableLink ? `/stage/${encodeURIComponent(lifestage._id)}` : null}
                data-testid='lifestage-card-link'
                className={disableLink ? 'link-disabled' : null}
            >
                <img 
                    src='https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg' 
                    className="card-img"
                    alt={`Image of Abby in ${lifestage.date_start.slice(0,4)}`}
                />
                <h4>
                    {lifestage.date_start.slice(0,4)} - {lifestage.date_end.slice(0,4)}
                </h4>
                <h3>
                    <span>
                        {lifestage.title.slice(12)}
                    </span>
                </h3>

                <aside className='skill-tag-container'>
                    {lifestage.hard_skills.slice(0,3).map(skill => (
                        <Tag 
                            key={skill} 
                            disableHover
                        >
                            {skill}
                        </Tag>
                    ))}
                </aside>
            </Link>
        </li>
    );
};

export default LifestageCard;
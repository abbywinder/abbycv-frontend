import Tag from '../../components/Tag';
import { palette } from '../../palette';

const LifestageCard = ({lifestage}) => {

    return (
        <li
            className="card-container"
            style={{
                border: `solid 3px ${palette.accent}`
            }}
        >
            <a>
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
                        <Tag>{skill}</Tag>
                    ))}
                </aside>
            </a>
        </li>
    );
};

export default LifestageCard;
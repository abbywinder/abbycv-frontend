import { Fragment } from 'react'
import { useParams } from 'react-router-dom';
import { useLifestages, useOneLifestage } from '../../api/queries';
import ErrorBoundary from '../../components/ErrorBoundary';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Tag from '../../components/Tag';
import { capitalize } from '../../utils/functions';
import './lifestage.css';

const LifestageScreen = () => {
    const { stageId } = useParams();

    const { data: lifestage, isLoading, isError } = useOneLifestage(stageId);

    if (isLoading) {
        return <Loading />
    };

    return (
        <ErrorBoundary hasError={isError}>
            <Header />
            <div 
                className='container'
                style={{    
                    backgroundColor: lifestage.background_col,
                    color: 'white'
                }}
            >
                <section 
                    id='title' 
                    data-testid='title'
                >
                    <h1>
                        {lifestage.title.slice(12)}
                    </h1>
                    <h2>
                        {lifestage.date_start.slice(0,4)} - {lifestage.date_end.slice(0,4)}
                    </h2>
                </section>
                
                <section className='desc-img-container'>
                    <div data-testid='description'>
                        {lifestage.description && lifestage.description.map(paragraph => (
                            <p>{paragraph}</p>
                        ))}

                        {lifestage.achievements && lifestage.achievements.length ?
                            <Fragment>
                                <h3>Achievements</h3>
                                <ul>
                                    {lifestage.achievements.map(achievement => (
                                        <li>{achievement}</li>
                                    ))}
                                </ul>
                            </Fragment>
                        : null}
                    </div>

                    <div data-testid='images'>
                        <img 
                            src='https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg' 
                            className="images"
                            alt={`Examples of ${lifestage.title}`}
                        />
                    </div>
                </section>

                <section 
                    data-testid='skills'
                    className='skills-container'
                >
                    {['hard_skills','soft_skills'].map(skill_cat => (
                        lifestage[skill_cat] && lifestage[skill_cat].length ?
                            <div key={skill_cat}>
                                <h3>{capitalize(skill_cat.replace('_',' '))}</h3>
                                <div>
                                    {lifestage[skill_cat].map(e => (
                                        <Tag key={e}>{e}</Tag>
                                    ))}
                                </div>
                            </div>
                        : null
                    ))}
                </section>
            </div>
        </ErrorBoundary>
    );
};

export default LifestageScreen;
import Tag from "../../components/Tag";

const FilterSection = ({skills, setSelectedFilterTags, selectedFilterTags}) => {
    return (
        <ul className='filter-tags-container'>
            {skills.map((each, i) => (
                <Tag 
                    key={each._id}
                    i={i}
                    testName="header-filter-tags"
                    handleClick={() => setSelectedFilterTags(prev => prev.includes(each._id) ? prev.filter(e => e !== each._id) : [...prev, each._id])}
                    selected={selectedFilterTags.includes(each._id)}
                >
                    {each._id}
                </Tag>
            ))}
        </ul>
    )
};

export default FilterSection;
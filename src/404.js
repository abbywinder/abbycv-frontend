import { Link } from 'react-router-dom';

const Page404 = () => {

  return (
    <div className='container-404'>
        <h1>
          404 Not Found!
        </h1>
        <Link to='/' data-testid='back-link'>
          <button>
            Go back
          </button>
        </Link>
    </div>
  );
};

export default Page404;

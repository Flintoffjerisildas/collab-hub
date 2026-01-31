import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
            <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
            <Link to="/" className="mt-8 text-primary hover:underline">
                Go back home
            </Link>
        </div>
    );
};

export default NotFound;

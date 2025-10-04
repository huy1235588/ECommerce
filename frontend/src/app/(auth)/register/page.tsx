import { Metadata } from 'next';

export const metadata: Metadata = {

};

interface RegisterPageProps {
    searchParams: Promise<{
        message?: string;
        error?: string;
    }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
    const params = await searchParams;
    const message = params.message || params.error;

    return (
        <div>
            Register
        </div>
    );
}

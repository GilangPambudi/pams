import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Registration Disabled"
            description="Registration is currently disabled"
        >
            <Head title="Register" />
            <div className="text-center text-muted-foreground">
                <p>Registration is not available.</p>
            </div>
        </AuthLayout>
    );
}

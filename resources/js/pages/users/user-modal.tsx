import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    user?: User;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function UserModal({ user, trigger, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && user) {
            put(route('users.update', user.id), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('User updated successfully');
                    onSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to update user');
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('User created successfully');
                    onSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to create user');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40%] md:max-w-[40%] lg:max-w-[40%]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update user details.' : 'Create a new user.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="John Doe"
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={isEditing ? 'Leave blank to keep current' : '********'}
                        />
                        <InputError message={errors.password} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Update User' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

'use client';
import { useForm } from 'react-hook-form';
import { SelectValue as SelectValueType } from 'react-tailwindcss-select/dist/components/type';

import { zodResolver } from '@hookform/resolvers/zod';

import MultiSelect from '~/components/molecules/multi-select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

import { ChannelSettingFormType, channelSettingSchema, RolesEnum } from '../schema/form';

const rolesOption: { label: string; value: RolesEnum }[] = [
    {
        label: 'OWNER',
        value: 'owner',
    },
    {
        label: 'MANAGER',
        value: 'manager',
    },
    {
        label: 'REVIEWER',
        value: 'reviewer',
    },
    {
        label: 'VIDEO EDITOR',
        value: 'video_editor',
    },
    {
        label: 'CONTENT EDITOR',
        value: 'content_editor',
    },
];

const MemberForm = () => {
    const form = useForm<ChannelSettingFormType>({
        resolver: zodResolver(channelSettingSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = (value: ChannelSettingFormType) => {
        //
    };
    return (
        <Card className="flex-grow">
            <CardHeader>
                <CardTitle>Add a member</CardTitle>
                <CardDescription>as manager, video editor, or content editor, etc.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-3 gap-x-4 gap-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fullname *</FormLabel>
                                    <FormControl>
                                        <Input className="peer" placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                        {form.getValues('name').length}/50
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input className="peer" type="email" placeholder="example@email.com" {...field} />
                                    </FormControl>
                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                        {form.getValues('email').length}/50
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Roles *</FormLabel>
                                    <MultiSelect
                                        options={rolesOption}
                                        primaryColor=""
                                        value={field.value as unknown as SelectValueType}
                                        onChange={field.onChange}
                                    />
                                </FormItem>
                            )}
                        />
                        <Accordion type="single" collapsible className="col-span-3 w-full">
                            <AccordionItem
                                value="item-1"
                                className="space-y-4 rounded-md border-none transition-all duration-300 ease-in-out"
                            >
                                <AccordionTrigger className="flex-row-reverse justify-end gap-2 p-0 hover:no-underline">
                                    Contact details
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="mx-[0.5px] grid grid-cols-3 gap-x-4 gap-y-5">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="peer"
                                                            type="tel"
                                                            placeholder="+91 9292929292"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('phone')?.length}/20
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="primary">Primary</SelectItem>
                                                            <SelectItem value="alternate">Alternate</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input className="peer" placeholder="Mumbai" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('city')?.length}/20
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="addressLine1"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Address line 1</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="peer"
                                                            placeholder="Flat no., Building no."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('addressLine1')?.length}/20
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal code</FormLabel>
                                                    <FormControl>
                                                        <Input className="peer" placeholder="100001" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('postalCode')?.length}/20
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="addressLine2"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address line 2</FormLabel>
                                                    <FormControl>
                                                        <Input className="peer" placeholder="Street address" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('addressLine2')?.length}/255
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input className="peer" placeholder="Maharashtra" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('state')?.length}/56
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <FormControl>
                                                        <Input className="peer" placeholder="India" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                                        {form.getValues('country')?.length}/48
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Button className="col-end-4 w-fit place-self-center">Add user</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default MemberForm;

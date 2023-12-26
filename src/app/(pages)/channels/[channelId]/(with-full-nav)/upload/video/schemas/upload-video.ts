import z from 'zod';

export const uploadVideoSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: 'Title must be at least 2 characters.',
        })
        .max(100, {
            message: 'Title must be at most 100 characters.',
        }),
    description: z
        .string()
        .min(5, {
            message: 'Description must be at least 5 characters.',
        })
        .max(5000, {
            message: 'Description must be at most 5000 characters.',
        }),
    playlist: z
        .array(
            z.object({
                label: z
                    .string()
                    .min(2, {
                        message: 'Description must be at least 2 characters.',
                    })
                    .max(50, {
                        message: 'Description must be at most 50 characters.',
                    }),
                value: z
                    .string()
                    .min(2, {
                        message: 'Description must be at least 2 characters.',
                    })
                    .max(50, {
                        message: 'Description must be at most 50 characters.',
                    }),
                disabled: z.boolean(),
                isSelected: z.boolean(),
            })
        )
        .nullable(),
    contentForKids: z.enum(['yes', 'no'], {
        required_error: 'You have to select your audience type.',
    }),
    ageRestriction: z.enum(['yes', 'no'], {
        required_error: 'You have to select age restriction.',
    }),
});

export type UploadVideoFormType = z.infer<typeof uploadVideoSchema>;

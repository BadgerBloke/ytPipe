import { z } from 'zod';

const rolesEnum = z.enum(['owner', 'manager', 'reviewer', 'video_editor', 'content_editor']);

export const channelSettingSchema = z.object({
    name: z.string().max(50, 'Name must be at most 50 characters.'),
    email: z.string().email(),
    roles: z.array(rolesEnum).optional(),
    phone: z.string().max(20, 'Name must be at most 50 characters.').optional(),
    type: z.enum(['primary', 'alternate']).optional(),
    addressLine1: z.string().max(255, 'Address line 1 must be at most 255 characters.').optional(),
    addressLine2: z.string().max(255, 'Address line 2 must be at most 255 characters.').optional(),
    city: z.string().max(56, 'City must be at most 56 characters.').optional(),
    postalCode: z.string().max(16, 'Postal code must be at most 16 characters.').optional(),
    state: z.string().max(255, 'State must be at most 56 characters.').optional(),
    country: z.string().max(48, 'Country must be at most 48 characters.').optional(),
    logo: z.string().url().optional(),
});

export type ChannelSettingFormType = z.infer<typeof channelSettingSchema>;
export type RolesEnum = z.infer<typeof rolesEnum>;

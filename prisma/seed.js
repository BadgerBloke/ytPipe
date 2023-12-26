const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
    try {
        // Seed Users
        const user1 = await prisma.user.create({
            data: {
                ssoUserId: '3294cde5-e2f1-4321-a805-b457163a2ac9',
                name: 'Test User',
                email: 'email@test.com',
                isActive: true,
                // ... other user fields
            },
        });

        const user2 = await prisma.user.create({
            data: {
                ssoUserId: '0b6a7844-5837-434c-a501-dd8fab25eb47',
                name: 'Super Admin',
                email: 'admin@mksingh.in',
                isActive: true,
                // ... other user fields
            },
        });

        // Seed Channels
        const channel1 = await prisma.channel.create({
            data: {
                name: 'Test User Channel',
                isActive: true,
                // ... other channel fields
            },
        });

        const channel2 = await prisma.channel.create({
            data: {
                name: 'MKSingh',
                isActive: true,
                // ... other channel fields
            },
        });

        // Seed UsersToChannels
        const utc = await prisma.usersToChannels.create({
            data: {
                userId: user1.id,
                ssoUserId: user1.ssoUserId,
                channelId: channel1.id,
                isActive: true,
                // ... other usersToChannels fields
            },
        });

        await prisma.usersToChannels.create({
            data: {
                userId: user2.id,
                ssoUserId: user2.ssoUserId,
                channelId: channel2.id,
                isActive: true,
                // ... other usersToChannels fields
            },
        });

        // Seed Plans
        await prisma.plan.create({
            data: {
                name: 'Essential',
                code: 'basic',
                stripePriceId: 'price_1OCOtESD9zeynP1vzYB4VtPU',
                description: 'Everything you need to start delegating your YouTube work.',
                featuresDetail: '5GB parking space\\nAdd upto 10 members\\nControl pannel access',
                price: 1999,
                mrp: 1999,
                currency: 'INR',
                billingCycle: 'monthly',
                createdById: utc.id,
                updatedById: utc.id,
            },
        });
        await prisma.plan.create({
            data: {
                name: 'Essential',
                code: 'basic',
                stripePriceId: 'price_1OCOsWSD9zeynP1vaTBLGLnN',
                description: 'Everything you need to start delegating your YouTube work.',
                featuresDetail: '5GB parking space\\nAdd upto 10 members\\nControl pannel access',
                price: 21_589,
                mrp: 23_988,
                currency: 'INR',
                billingCycle: 'yearly',
                createdById: utc.id,
                updatedById: utc.id,
            },
        });

        await prisma.plan.create({
            data: {
                name: 'Comfort',
                code: 'pro',
                stripePriceId: 'price_1OCOrUSD9zeynP1vlwawEBD0',
                description: 'Have fine grained control and information on your finger tips.',
                featuresDetail:
                    'Everything included in essential, plus\\n20GB parking space\\nGet notification on WhatsApp\\nReview and approve publishable from WhatsApp',
                price: 4499,
                mrp: 4499,
                currency: 'INR',
                billingCycle: 'monthly',
                createdById: utc.id,
                updatedById: utc.id,
            },
        });

        await prisma.plan.create({
            data: {
                name: 'Comfort',
                code: 'pro',
                stripePriceId: 'price_1OCOq5SD9zeynP1vHPGMHwtP',
                description: 'Have fine grained control and information on your finger tips.',
                featuresDetail:
                    'Everything included in essential, plus\\n20GB parking space\\nGet notification on WhatsApp\\nReview and approve publishable from WhatsApp',
                price: 48_589,
                mrp: 53_988,
                currency: 'INR',
                billingCycle: 'yearly',
                createdById: utc.id,
                updatedById: utc.id,
            },
        });

        await prisma.plan.create({
            data: {
                name: 'Customized',
                code: 'biz',
                stripePriceId: '',
                description: "Need more space, more personalized feature. Let's have a call",
                featuresDetail: 'Unlimited parking space\\nCustomized specific feature',
                price: 0,
                mrp: 0,
                currency: 'INR',
                billingCycle: 'monthly',
                createdById: utc.id,
                updatedById: utc.id,
            },
        });

        // // Seed Orders
        // await prisma.order.create({
        //     data: {
        //         totalAmount: 100.0,
        //         currency: 'USD',
        //         isActive: true,
        //         status: 'payment_not_initiated',
        //         planId: plan1.id,
        //         // ... other order fields
        //     },
        // });

        // await prisma.order.create({
        //     data: {
        //         totalAmount: 200.0,
        //         currency: 'USD',
        //         isActive: true,
        //         status: 'payment_not_initiated',
        //         planId: plan2.id,
        //         // ... other order fields
        //     },
        // });

        // // Seed Payments
        // await prisma.payment.create({
        //     data: {
        //         amount: 100.0,
        //         currency: 'USD',
        //         status: 'initiated',
        //         method: 'credit_card',
        //         cardNumber: '**** **** **** 1234',
        //         orderId: 'order_id_1', // replace with the actual order ID
        //         // ... other payment fields
        //     },
        // });

        // await prisma.payment.create({
        //     data: {
        //         amount: 200.0,
        //         currency: 'USD',
        //         status: 'initiated',
        //         method: 'credit_card',
        //         cardNumber: '**** **** **** 5678',
        //         orderId: 'order_id_2', // replace with the actual order ID
        //         // ... other payment fields
        //     },
        // });

        // // Seed Contacts
        // await prisma.contact.create({
        //     data: {
        //         type: 'primary',
        //         phone: '123-456-7890',
        //         // ... other contact fields
        //     },
        // });

        // await prisma.contact.create({
        //     data: {
        //         type: 'alternate',
        //         phone: '987-654-3210',
        //         // ... other contact fields
        //     },
        // });
    } catch (error) {
        console.error('Error during seed data creation:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seedData function
seedData();

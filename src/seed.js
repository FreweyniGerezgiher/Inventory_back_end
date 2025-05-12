const bcrypt = require('bcrypt');
const db = require('./models/mysql');

async function seed() {
    try {
        await db.sequelize.sync(); 

        const [location, createdLocation] = await db.locations.findOrCreate({
            where: { name: 'Head Office' },
            defaults: {
                name: 'Head Office',
                address: '453 Main St, Mekelle, Ethiopia',
                is_primary: true
            }
        });

        console.log(createdLocation ? '✅ Head Office created' : 'ℹ️ Head Office already exists');

        // 2. Create Admin user
        const adminEmail = 'admin@example.com';
        const existingUser = await db.users.findOne({ where: { email: adminEmail } });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            await db.users.create({
                first_name: 'System',
                last_name: 'Administrator',
                email: adminEmail,
                password: hashedPassword,
                status: 1,
                location_id: location.id
            });

            console.log('Admin user created');
        } else {
            console.log('ℹAdmin user already exists');
        }

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await db.sequelize.close();
    }
}

seed();

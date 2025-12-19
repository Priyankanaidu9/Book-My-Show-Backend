// Quick script to generate a random JWT secret
import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Generated JWT Secret:');
console.log(secret);
console.log('\nCopy this and paste it in your .env file as JWT_SECRET\n');


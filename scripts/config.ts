import { ContractNetworksConfig } from '@safe-global/protocol-kit';
import dotenv from 'dotenv';

dotenv.config();

export const PRIVATE_KEY = process.env.DEPLOYER_ADDRESS_PRIVATE_KEY || '';
if (!PRIVATE_KEY) {
    if (!process.argv[1].includes('deploySafe')) {
        console.log('❌ No private key found in env file');
        process.exit(1);
    }
}

export const OTHER_PK = process.env.OTHER_PK || ""
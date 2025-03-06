export interface ConfigSigner {
    CHAIN_ID: bigint;
    RPC_URL: string;
    SIGNER_ADDRESS_PRIVATE_KEY: string;
    SAFE_ADDRESS: string;
    TX_SERVICE_URL: string;
    SAFE_TX_HASH: string;
}

export interface ConfigDeployer {
    RPC_URL: string;
    DEPLOYER_ADDRESS_PRIVATE_KEY: string;
    DEPLOY_SAFE: {
        OWNERS: string[];
        THRESHOLD: number;
        SALT_NONCE: string;
        SAFE_VERSION: string;
    };
}
import Safe, {
    ContractNetworksConfig,
    PredictedSafeProps,
    SafeAccountConfig,
    SafeDeploymentConfig
} from '@safe-global/protocol-kit'
import { sepolia } from 'viem/chains'

import { PRIVATE_KEY } from './config'

const owners = ["0xFCAffE6C34118F897A9d8f45366d9b88A434fE73", "0x642366CAF3964b70574910374De3C1Cbe9f6D620"]

const safeAccountConfig: SafeAccountConfig = {
    owners: owners,
    threshold: 2
    // More optional properties
}

const predictedSafe: PredictedSafeProps = {
    safeAccountConfig
    // More optional properties
}


const main = async () => {
    const protocolKit = await Safe.init({
        provider: "https://eth-sepolia.public.blastapi.io",
        signer: PRIVATE_KEY,
        predictedSafe,
    })

    const safeAddress = await protocolKit.getAddress()

    console.log('Safe address:', safeAddress)

    const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()

    const client = await protocolKit.getSafeProvider().getExternalSigner()

    if (!client) {
        throw new Error('No client found')
    }

    const transactionHash = await client.sendTransaction({
        to: deploymentTransaction.to,
        value: BigInt(deploymentTransaction.value),
        data: deploymentTransaction.data as `0x${string}`,
        chain: sepolia
    })

    const newProtocolKit = await protocolKit.connect({
        safeAddress
    })

    const isSafeDeployed = await newProtocolKit.isSafeDeployed() // True
    const safeAddress2 = await newProtocolKit.getAddress()
    const safeOwners = await newProtocolKit.getOwners()
    const safeThreshold = await newProtocolKit.getThreshold()

    console.log('Safe deployed:', isSafeDeployed)
    console.log('Safe address:', safeAddress2)
    console.log('Safe owners:', safeOwners)
    console.log('Safe threshold:', safeThreshold)

}

main()
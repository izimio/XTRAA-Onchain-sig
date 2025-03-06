import Safe, {
    ContractNetworksConfig,
    PredictedSafeProps,
    SafeAccountConfig,
    SafeDeploymentConfig
} from '@safe-global/protocol-kit'
import { sepolia } from 'viem/chains'
import { ethers } from 'ethers'

import { PRIVATE_KEY } from './config'

const owners = ["0xFCAffE6C34118F897A9d8f45366d9b88A434fE73", "0x791AFE27366c8AD8F04481ebBD72b37948Cc52d2"]

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

    console.log(safeAddress)
}

main()
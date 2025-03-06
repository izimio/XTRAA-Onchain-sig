import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { MetaTransactionData, OperationType } from '@safe-global/types-kit'
import { OTHER_PK, PRIVATE_KEY, RPC_URL } from './config'
import { ethers } from "ethers"

const SAFE_ADDRESS = "0x2F41a7f2ef5F05FF679B98985117b95E2f577FEB"

const wallet1 = new ethers.Wallet(PRIVATE_KEY)
const wallet2 = new ethers.Wallet(OTHER_PK)

console.log("🔹 Wallets initialized")

const main = async () => {
    const safeTransactionData: MetaTransactionData = {
        to: wallet2.address,
        value: '0', // 1 wei
        data: '0x',
        operation: OperationType.Call
    }

    console.log("🔹 Safe transaction data prepared:", safeTransactionData)

    const provider = new ethers.JsonRpcProvider(RPC_URL)

    console.log("🟢 Initializing Safe for Owner 1...")
    const protocolKitOwner1 = await Safe.init({
        provider: RPC_URL,
        signer: wallet1.privateKey,
        safeAddress: SAFE_ADDRESS,
    })
    console.log("✅ Safe initialized for Owner 1")

    console.log("🟢 Initializing Safe for Owner 2...")
    const protocolKitOwner2 = await Safe.init({
        provider: RPC_URL,
        signer: wallet2.privateKey,
        safeAddress: SAFE_ADDRESS
    })
    console.log("✅ Safe initialized for Owner 2")

    console.log("🟢 Initializing Safe API Kit...")

    const apiKit = new SafeApiKit({
        chainId: 11155111n,
        txServiceUrl: "http://localhost:8888/api",
    })
    console.log("✅ Safe API Kit initialized")

    console.log("🟢 Creating Safe transaction...")
    const safeTransaction = await protocolKitOwner1.createTransaction({
        transactions: [safeTransactionData]
    })
    console.log("✅ Safe transaction created:", safeTransaction)

    console.log("🟢 Getting transaction hash...")
    const safeTxHash = await protocolKitOwner1.getTransactionHash(safeTransaction)
    console.log("✅ Safe transaction hash:", safeTxHash)

    console.log("🟢 Signing transaction hash with Owner 1...")
    const senderSignature = await protocolKitOwner1.signHash(safeTxHash)
    console.log("✅ Owner 1 signed transaction:", senderSignature)

    console.log("🟢 Proposing transaction to Safe API Kit...")
    try {
        console.log
        const res = await apiKit.proposeTransaction({
            safeAddress: SAFE_ADDRESS,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: wallet1.address,
            senderSignature: senderSignature.data
        })
    } catch (e) {
        console.log("🔴 Error proposing transaction:", e)
        process.exit(1)
    }
    console.log("✅ Transaction proposed")

    console.log("🟢 Fetching pending transactions...")

    console.log("🟢 Signing transaction hash with Owner 2...")
    const signature = await protocolKitOwner2.signHash(safeTxHash)
    console.log("✅ Owner 2 signed transaction:", signature)

    console.log("🟢 Confirming transaction via Safe API Kit...")
    const signatureResponse = await apiKit.confirmTransaction(
        safeTxHash,
        signature.data
    )
    console.log("✅ Transaction confirmed:", signatureResponse)

    console.log("🟢 Fetching transaction details...")
    const safeTransaction2 = await apiKit.getTransaction(safeTxHash)
    console.log("✅ Retrieved transaction:", safeTransaction2)

    console.log("🟢 Executing Safe transaction...")
    const executeTxResponse = await protocolKitOwner1.executeTransaction(safeTransaction2)
    console.log("✅ Transaction executed:", executeTxResponse)

    console.log("🎉 Safe transaction process completed successfully!")

}

main()
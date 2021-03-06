import { RocketNetworkWithdrawal, RocketVault } from '../_utils/artifacts';


// Deposit a validator withdrawal
export async function depositWithdrawal(txOptions) {

    // Load contracts
    const [
        rocketNetworkWithdrawal,
        rocketVault,
    ] = await Promise.all([
        RocketNetworkWithdrawal.deployed(),
        RocketVault.deployed(),
    ]);

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketNetworkWithdrawal.getBalance.call(),
            web3.eth.getBalance(rocketVault.address).then(value => web3.utils.toBN(value)),
        ]).then(
            ([withdrawalPoolEth, vaultEth]) =>
            ({withdrawalPoolEth, vaultEth})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Deposit withdrawal
    txOptions.to = rocketNetworkWithdrawal.address;
    await web3.eth.sendTransaction(txOptions);

    // Get updated balances
    let balances2 = await getBalances();

    // Calculate values
    let txValue = web3.utils.toBN(txOptions.value);

    // Check balances
    assert(balances2.withdrawalPoolEth.eq(balances1.withdrawalPoolEth.add(txValue)), 'Incorrect updated withdrawal pool balance');
    assert(balances2.vaultEth.eq(balances1.vaultEth.add(txValue)), 'Incorrect updated vault balance');

}


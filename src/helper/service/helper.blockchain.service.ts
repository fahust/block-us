import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class HelperBlockchainService {
  async connect(alchemyKey: string, metamaskPrivateKey: string) {
    const provider = new ethers.AlchemyProvider('goerli', alchemyKey);
    const Wallet = new ethers.Wallet(metamaskPrivateKey, provider);
  }

  async getStatusTransaction(
    alchemyKey: string,
    txHash: string,
  ): Promise<ethers.TransactionReceipt> {
    const provider = new ethers.AlchemyProvider('goerli', alchemyKey);
    return provider.getTransactionReceipt(txHash);
  }
}

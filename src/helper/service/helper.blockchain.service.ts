import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ChainId } from '../enum/network.enum';

@Injectable()
export class HelperBlockchainService {
  async connect(
    alchemyKey: string,
    metamaskPrivateKey: string,
    network: ChainId,
  ) {
    const provider = new ethers.AlchemyProvider(network, alchemyKey);
    const Wallet = new ethers.Wallet(metamaskPrivateKey, provider);
  }

  async getStatusTransaction(
    alchemyKey: string,
    txHash: string,
    network: ChainId,
  ): Promise<ethers.TransactionReceipt> {
    const provider = new ethers.AlchemyProvider(network, alchemyKey);
    return provider.getTransactionReceipt(txHash);
  }
}

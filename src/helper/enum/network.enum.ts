export enum StorageEnum {
    IPFS = 'ipfs',
    S3 = 's3'
}

export enum NetworkNameEnum {
    Goerli = 'goerli',
    Mumbai = 'mumbai'
}

export enum NetworkChainEnum {
    Ethereum = 'ethereum',
    Polygon = 'polygon'
}

export enum NetworkTypeEnum {
    Mainnet = 'mainnet',
    Testnet = 'testnet'
}

export enum NetworkCurrencyEnum {
    EthereumMainnet = 'ETH',
    EthereumGoerli = 'ETH',
    PolygonMumbai = 'MATIC',
    PolygonMainnet = 'MATIC'
}

export enum ContractDeployStatus {
    ONGOING = 'ONGOING',
    DEPLOYED = 'DEPLOYED'
}

export enum BlockHash {
    FIRST = '0x0',
    LAST = 'latest'
}

export enum ChainId {
    ETHEREUMGOERLI = 5,
    ETHEREUMMAINNET = 1,
    POLYGONMAINNET = 137,
    POLYGONMUMBAI = 1337
}

export enum ChainIdHexa {
    ETHEREUMGOERLI = '0x5',
    ETHEREUMMAINNET = '0x1',
    POLYGONMAINNET = '0x89',
    POLYGONMUMBAI = '0x13881'
}

export enum ChainName {
    ETHEREUMGOERLI = 'ethereum-goerli',
    ETHEREUMMAINNET = 'ethereum-mainnet',
    POLYGONMAINNET = 'polygon-mainnet',
    POLYGONMUMBAI = 'polygon-mumbai'
}

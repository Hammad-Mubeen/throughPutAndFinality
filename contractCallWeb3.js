import {Web3} from 'web3';

let RPC_URLs = [
`http://18.190.161.56:8020/rpc/ethrpc`,
`http://18.190.161.56:8030/rpc/ethrpc`,
`http://18.190.161.56:8040/rpc/ethrpc`,
`http://18.190.161.56:8050/rpc/ethrpc`];

let index = 0;
let CONTRACT_ADDRESS = "0x67F1a9F8b4f40015D47Fc296Df9aFC3E7f9B4c3d";
let AMOUNT_TO_REWARD = 100; // Each reward call mints this much
let gas = 50000;
let nonce = 502;
let TPS = 35, whenToChangePort = TPS/2;
let txHashes= [];


// Minimal ABI with reward function
const ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "reward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let wallets = [
  {
      "address": "0x66E515675F5647aFCaCb9F13f628027678aEfe1c",
      "pk": "0xa8c802f9b1b06463ab95ede0dc9857922df74817072c4f91f5477c09f14e3461"
  },
  {
      "address": "0xF0491f3ACD253D08cB96f792B49AeF5ba12352E3",
      "pk": "0x270369edb47d7c36e1dba4c89744f08d1dc7e0c328b6df310e1dc7c275a5b28f"
  },
  {
      "address": "0x47241a26DFeA3b202E251Da0b4D69f4940a2dE3b",
      "pk": "0xe5f1d87d8b148637cbf6b925d1dc925ad448864549a089df15b9e818924794dc"
  },
  {
      "address": "0x4B75b0Ed31Ce9C6A236D8840022d68f46768E265",
      "pk": "0x64f5754d3b6453c3d2cc42f9d10691f4c75d8750354866cdb9550517e355740e"
  },
  {
      "address": "0x48dd8C31e163867b69a729A8C1e00570B817D14a",
      "pk": "0xe85c6e3c3b77bb41c8cb06407b3c35a0d14244db50b1eaad481412333db98259"
  },
  {
      "address": "0x111dE7dB97b67cb55cc32495B25b9C64B8a59A24",
      "pk": "0x53d9e8221f7a1782a396df82b1bf7ff2381cf1377f649e082c9f1ca98ad81d40"
  },
  {
      "address": "0x8595f628A8ae6C367ECD44276D283c3a0Dd1DC16",
      "pk": "0x0dbf8d9c33a155745c850a7065dcf154d3f8e8d39daedffce1fe6d30abcb345f"
  },
  {
      "address": "0xF8f22127436A5690D66F44e184f1D43f8c643e07",
      "pk": "0x825fe3f1254c592f9374984d6d7d121595c37feaaa75a94748c52ab2eba30b74"
  },
  {
      "address": "0xd8a37716864503E412c708c47D7C96ad6C9D1D0e",
      "pk": "0x62c2845584eb4a365c524ea7ca2e9904f8b89f99c9810e77b0dcf5c7f1f7b294"
  },
  {
      "address": "0x6A47843080824Ab50c533A68C5a806e9ee7dbF30",
      "pk": "0xbc94bcbb38f7f7c52d58ace015e71abf9abe9c9be50066ee3083c0ee4e439f44"
  },
  {
      "address": "0x0990b49D58818F98458e805b07F47fB9fc0c1DaF",
      "pk": "0x1018996a7bb20fa9e1c00c93cb18584496988eb450ecefc747d7ae36d6854edd"
  },
  {
      "address": "0xBF96e258f4c66476EE449ADE652Bb6137B8Db6E7",
      "pk": "0x8bff85e03092756b9f6e8a61c79c3ca2435c6f6f4f246ec0471b54a1670f8ea6"
  },
  {
      "address": "0xbf95bFB45959AAa728d2515E53DFeE9f9A628296",
      "pk": "0x9dfc9c2995945a25d39b67d2a79d8d2d0301ae7c7f706ac3c4872dec2c224d67"
  },
  {
      "address": "0x2D94a186996b1C51001aD57fBCf70D18EA8d302d",
      "pk": "0xda5e5195892f4b17c26974ec833fc57f5392e2b7a0606cd40172be98d84677ff"
  },
  {
      "address": "0xdba2806D5eFd1363f89d6c1269F6b4C8FA30c127",
      "pk": "0x4224480ab9dd72039657fb1274da55984c84968f602cddcf2084d12be5ceb95e"
  },
  {
      "address": "0x262B4E4f89302b38Bb53fEfC0193652F56e62a69",
      "pk": "0xce8cfd31e86b66a1bdd1ced39826761274300a1c3d3d27b61ce8f51825775147"
  },
  {
      "address": "0xBf0312840EeabdcA099e99b2d0893e780e30aE50",
      "pk": "0x55aa7d1803d4c4c506c08d08c64f11a3ccd43b5f6e375b22e8c4ec45f4cf3717"
  },
  {
      "address": "0x9027037f2016a277617de6C7406Ef4E8F4C4bC10",
      "pk": "0x8b19997af8208385982f0f7851ffe0b52bed173af3dc0e21a8c568da26fd99d5"
  },
  {
      "address": "0xFaF8D8a1c85F92597341EA14d79a6f2be05A8b89",
      "pk": "0xa33f5618d4a804bdd831b81e3a804cb53b6f57e7c658bedd88c0724f13388cd9"
  },
  {
      "address": "0x4633e78FB555A0F836Ba9c481F650c2dC7B5ab9D",
      "pk": "0x3080ec124d2378f4464dea5f0311f1ed96f511047f19ad0a7fe010de8ef68c54"
  },
  {
      "address": "0x718De3198a6cF85037cFEbcc50291014E5D8E103",
      "pk": "0xee1a475b0d1a0c0af054a09be7acff3928eab7cc05ce2a9e91d294d56218e700"
  },
  {
      "address": "0xB4FdC3d826b58519f010cC3A57ED6f1857C3716C",
      "pk": "0x94ceee06d9b3f1ad3f6bd22f299de1d21b8c13438e6ffe4b34c4dfdfcf689b06"
  },
  {
      "address": "0x23ea7D98133544FBE80f765b7827E9E2cC348001",
      "pk": "0xbea50d428e4ee9ed7020ba2642472bc51fe46a73a34a6f77d37e840b25c55bc7"
  },
  {
      "address": "0xf5d1F055FF1669570919dc2526Cc6a7489d66138",
      "pk": "0x757fe32e21f7a543a6b8a3426408eb4b7d7f45f5fd7787f57c354c476a7d067f"
  },
  {
      "address": "0x2C5cF7EDB6bE5faca162a24bf80Ab5A3C6Ab4174",
      "pk": "0x1ed346fbaf6c6dab67db33252027d08815e095784299e2f366bfeb5f8651c1c8"
  },
  {
      "address": "0xdA6a5E5eA874B73A360D58312aA4a5c1eAE03308",
      "pk": "0xbea558ce786fb7d2dbd5357f4a2f334477e85d7374f5ce92f614ecf5510f515f"
  },
  {
      "address": "0xbe0a1D41bFE6c059B35b55AD3c71422541d7058A",
      "pk": "0xd601eeb83f1af37cb6756e01d3325130d3baba33795f8dc6913e1733eed6cc4c"
  },
  {
      "address": "0x90681a6D716321e9c8969e990F1a59885D26bed0",
      "pk": "0x9f556c8ee22dbf81f77301a3ee5e2818036c0be46c6af500bfa675c85de1ebf0"
  },
  {
      "address": "0xccB3a3d73D50158B0Ba2faCa13e4f8AFf9029541",
      "pk": "0x5dc20f7be0bc9219664ec5601d7a1a64880d5304d8fcb2f45e9a154a339ef3ea"
  },
  {
      "address": "0xe98Ef8EFC535b9856D00019ecc1e3683b21f00b9",
      "pk": "0x4699970dcab09da11e97de976da828578c2601b1296bb506d571adc89e40dce4"
  },
  {
      "address": "0x386e7d0ea5dca4f94142f245DCbBbbf375292290",
      "pk": "0xa87a090623231916f9d96da3395bf5c179fb734d823dcbdced34f1923ab9c600"
  },
  {
      "address": "0x439B3eEf18056Ce946B085d32978Eb23E5193F84",
      "pk": "0xa5d262b4ae78e401cdf1a4325a2c873bdf7d8f7e21534f8f7106f504ac8d4266"
  },
  {
      "address": "0x89903A471102332e31480504F5D0C907bADb6dBe",
      "pk": "0xfcdaa14a4dc1c3d6f359450c76fcac12da2ecf695d6541b9ef7f58da344ee948"
  },
  {
      "address": "0x63CFE2C1c75f7C1FCE60F8FA5eC375Ab30A04D04",
      "pk": "0x9dc9808048c3cc1e359e4eea4b9d3774c917e98a782e120e4925e74b9a59bb56"
  },
  {
      "address": "0xb86C8f7FaF954EEFe1C0b95658FA850B95c806aB",
      "pk": "0xe70274249684988423ce651173b71874118971c1ea1009bbb9446bdcb0a93203"
  },
  {
      "address": "0x2C90165cE9d132076CE4C4Fc14FFe8014D9c2Dee",
      "pk": "0x8ec7044a4448b5d5648e8f695b3e037b7e204ee9dc582cc8758cc4c661bcc357"
  },
  {
      "address": "0xf5EbbCCdaF1Dd0C751d3a0d3232694317EabE08A",
      "pk": "0x1896e3ffd602f2289d294116bb9a88da43b526af0a1d7d6235512471f7a36abd"
  },
  {
      "address": "0xEE52763234AbED733d229449c875119e1D2A84A8",
      "pk": "0x00d3019d2636badaed031b040072df46045916c022c764606473a9b22a6955b8"
  },
  {
      "address": "0xE587f45147d71989f4044C75641ef8ed03846296",
      "pk": "0xef2d6939137d8107e34cf6ecc92be8fbc130acc1a8a6ad4be869544132b713ad"
  },
  {
      "address": "0xD29fa73EC342709189cE068f93e87cb33342502b",
      "pk": "0x83a3d6195e7f85d37da2599a4898edae51e621b8ccbc505741bc278f7cb1ce7e"
  },
  {
      "address": "0x7bD0b254B55e41bf3C7c716efec8069063e5D646",
      "pk": "0x82e9e98c7e6b615ee43a0224c4015323aa139886978219625315fe99cd82345a"
  },
  {
      "address": "0x83de39b878A0C686677CcbEA402ad24Ac04A01f2",
      "pk": "0xa5c632fe0c665ab7b052faa4ea0edbf77310160349e67f7098b8e27fcea6aed9"
  },
  {
      "address": "0xC8b5c317eAff5A1BedCB0e27c9C11B5a9668105d",
      "pk": "0xfca17ae670d36fc48d65ba42e0e67d27c7a0c2781439e965c6ce1fc13af33ec8"
  },
  {
      "address": "0x4BbD1649d2B8Df3BEbd1A1dc5B5FCA9B643DD085",
      "pk": "0xab7de10ba55df1f1555b4ec71164e9931b4aa3544cfd3e1a090fe092a6148435"
  },
  {
      "address": "0xaC3a9D3bD3158F1aFdE8d9323BADde706D212fe5",
      "pk": "0x850e9d53ea2b0f7999fe3edae2daa2fd7151d228824878c848001ac577fed730"
  },
  {
      "address": "0x3a28c38d434cdf2a75CefEcF93aE09C3a811ab85",
      "pk": "0x5165e110a776f80759eef11c77bc6f6f0cdc08ba1f2ddcbaf8880022d5a9e6f5"
  },
  {
      "address": "0xB8743949d5AA91D2C29147093c1D19CA01B22CA3",
      "pk": "0x03bfda9860d725d09b871dbe17fe4435ac55d801c6504975018485abcb8c72dc"
  },
  {
      "address": "0x80Bb228760008Eaf41620AB16621f6A1258bE797",
      "pk": "0xf2357817e17e7ff8be9230f1dc8bbff284a48e4654d4b54726de3340d07dd121"
  },
  {
      "address": "0xA2BD41BD265428588371951d909B0e7C73FA501f",
      "pk": "0x6bc568b066801fff7a6c59090c8e9a767e0a7f126accb2c37d46fab200d4240c"
  },
  {
      "address": "0x13398F411Bf1C63F5B1D2bb026D6eb53Ac46796E",
      "pk": "0x6271bcd3d3edc8cd8b9d4cca6c08a775338d9056aefaae84ebcecd535412af31"
  },
  {
      "address": "0xE6D4313d74D4D42455b5854BF7230DC003A1764f",
      "pk": "0xc80c588db9d663f71d6c30edf3d3f9387594d56423f75cb41f6f60020205a99b"
  },
  {
      "address": "0xc55A2A77B5853FC400CBD19e74183541e0D69470",
      "pk": "0xc107aa8799f67a7c616d8f7fef99d79c75e6600294908b812fa6a5343223bff1"
  },
  {
      "address": "0xba8F39f7dB8F26b30912f9b1D54360CCB7994835",
      "pk": "0x8eb73467946c81b12ea6d086438f46790c9f8c3b72854495dd6c712bdac0feb9"
  },
  {
      "address": "0x96c919cAdF56d230480d1E275B5Cdf92Ec12b479",
      "pk": "0x7271201f0d41ff0b53d341844893f0764b1cc8e3e835ad2b0e8c63339364a4cd"
  },
  {
      "address": "0x0454F4e980c51bfE9082A7482004bFa0bB7B59C8",
      "pk": "0xa9241a2973fa96317709ab443a661ce3cc287f697bab9195df3322243cdda01f"
  },
  {
      "address": "0x63554D9E39CA2A08F90A669d07f74Ac76650cE11",
      "pk": "0x2b9ee1fef6ffe36a8eca165e26084b3fe5baed14cdb8b6959cadbe443d00d2ca"
  },
  {
      "address": "0xfa0d245F4F31c47d653bB02d1681E18E2A987C80",
      "pk": "0x4c0a1840bedcb6859c43fea40d69b7c09484d6b6653993a25fd4542dcab00b7b"
  },
  {
      "address": "0xD4cF3c432cd69A8cA3Ec2797f3F8827979C4eDe6",
      "pk": "0x802bceaecbf7dd9aef02b302c24b5ce900a7396b53737b2f53c26d670f40ff1a"
  },
  {
      "address": "0x896205766d4b57Db3Fe1C0f1746B089C7E466f1f",
      "pk": "0x59881ead5df1d14a15cd50b2077ec976e4667ca7e6fa97c8a0f7649e33857ffb"
  },
  {
      "address": "0x10f7734E8796D37dAd8946cECD2D2C2a2fD51380",
      "pk": "0x68e0c8e25e8dbe5de43c2035f7ee8eeaa6396856de68766d42115c2a6b2b5c27"
  },
  {
      "address": "0x9111d6e808D845427368c4A49565A843bc29cB8a",
      "pk": "0x00f4296eea0986be72ee576ce3bdc88b2f6e305245004690c86d55bfe0eeba18"
  },
  {
      "address": "0x0443b44AeACADDCb3b060AA1392d3481AD40886a",
      "pk": "0xfa11da4deab1ab9b13584c53e055e61d4557a6c7ac36b637eb0e7fdc9e2ae78d"
  },
  {
      "address": "0xCBD06087650D61F2E239216d5c4d91fdf1d7dfa6",
      "pk": "0x3aab8e540c3946ea0a23a2d11f85efdc10ce5aa9b9acd7065c85081e083c2b95"
  },
  {
      "address": "0x6F2cFDE357E70c92f7Efd3A8d73beE3804C53Da7",
      "pk": "0x9727cc3944de784da21601a4ec49ed8b0fb1aa125b1316c68ac01fe788768718"
  },
  {
      "address": "0x5C28aA4D2E7d6f751D061F8cB5d524f216C3a407",
      "pk": "0x8882de47d7301ff8205fd9cc866d729044e4ea3ba9f135f255a2e98624fd8d82"
  },
  {
      "address": "0x8EF4865513C78eCfc12A610EE629FD0ef8baBe4f",
      "pk": "0x3dae0e2943448c89668221042bd5dac3334066830aa7bc8ab57809bec11dc885"
  },
  {
      "address": "0xC6C98f59671344CAcdEaEaB10042cF5FC36a9029",
      "pk": "0x57200cabe269ad3c54915c54ca1168ea4371a4839ec69c8dae0a4cca0790e0b2"
  },
  {
      "address": "0xD5ad50dA8a9DE249524f2A7BCb54d15fd1BF6604",
      "pk": "0x66507facf648f72ec3ddce0f1ebd914b3e31e4c8dd7d6a2a3f587ceb3a18ea8f"
  },
  {
      "address": "0xD83716C5F6059cafcd6f2B764fE74B7f8658F7Ec",
      "pk": "0x97ed66e1fe9cfaac16947ac97d44517b6b34f54589a0605699cf856165c86274"
  },
  {
      "address": "0x52a29481174bA3fc315b4B431fcdb386f50c140D",
      "pk": "0x5959ceb62dbd9ab43e8a543e2da7006876e6b918f8721a41eefe4899fab37fed"
  },
  {
      "address": "0xd2c634438363643f0F1c619FBEfA3F279b03f5ca",
      "pk": "0xcbfc422108465ac343f98f2edb721a0af7648b9aec54f0f25364d05770576a0e"
  },
  {
      "address": "0x3f728983BaEb49d7916671DaE203A3f926541098",
      "pk": "0x359f7979f0e5c477740e4e28059c1a4943d25044c5607aff33d4536041d0bb70"
  },
  {
      "address": "0xAae93E95378028cA9977f9136eD2Dd1E0Fdd1f24",
      "pk": "0xa3f7632e15905c55f61709c4799f88d4080f5455b1150f93175fe7b7fc277e67"
  },
  {
      "address": "0xE1203E73217e65cfA4257e857917480329972C01",
      "pk": "0xe163b5d6d46d8bb28b5d3a4c541aee00700490457589a6bd19f33bf48261a8b2"
  },
  {
      "address": "0xaBAd54Bab48f72C834D641aDfbBab02878c1E228",
      "pk": "0x8d32c708ed8f4a4510f3a95fcccc4d5d731f04b28aee4429040e5f75fb3c2668"
  },
  {
      "address": "0x173696546674797C17189593F87790385C482ae2",
      "pk": "0xd2dfff5b556e0fe9279b825387d0a89293233041174d1387d6630cc36c80d527"
  },
  {
      "address": "0x57041CFD266Ec0A810e30593452C70FEaa192c75",
      "pk": "0xba9e04d53cfdf1113b24c54c14e08be82b72c9660b3a4889030bb3d1b5a04d94"
  },
  {
      "address": "0xbC5e11ab781834016D605704d78202001271F0F7",
      "pk": "0xe8401e7d55a0a2009c69bb7331d3cccbc489d18c954c95a80253ece90ed2ce9d"
  },
  {
      "address": "0x015cfDe85AC6F54f216A5739e77809d150D2Ed2B",
      "pk": "0x7cde70d5e583223d68d2e29bbb7e3cd1e3a7e525b15a190f5867d887a75baafb"
  },
  {
      "address": "0xbB4c12236dD2D43f14Aa6018D482229129657764",
      "pk": "0x042482a64010e10a154c6eb8496c52a98a772decca6817ab7307a278e6111729"
  },
  {
      "address": "0x48E47Cc2802b607C58D9d2637BA610262032F3f6",
      "pk": "0x5c45cf63043b39f8a070f7a448928756daadb7bf568893706a9e568df3ceff26"
  },
  {
      "address": "0xD01202F9dA3544fA0C8830547bf492753e5D5E76",
      "pk": "0x721600b95866a8f458705afe40a9ebff934cabbf0920301a06bea2bea936b328"
  },
  {
      "address": "0xc328bcd6A53DD0db7861023863D92BB3125c74a8",
      "pk": "0xede638e7e9fa8f344663a288dfe079a1a91986ff116c089c7906e9678dc70b06"
  },
  {
      "address": "0x8F48Bf6b02e346e511FB96deBCB78FFA0A349E6e",
      "pk": "0x6995401885dfabfcef9e9d1ea7851d14e761482ccbdf507bf1df63610d34bb2c"
  },
  {
      "address": "0xd5Ea6f79a744055e787878a871e822FB67209245",
      "pk": "0xafa30d1130b22d97065b662e23f31c7456da18250a0313d88f23d343da4f9678"
  },
  {
      "address": "0x4236dF80bfd6C82dDB25bd701C6c17326fEf262F",
      "pk": "0x121af06c665be61f4b9b3ddee75ff12b2d5e2a0f4099fa657f1c47da48d005e5"
  },
  {
      "address": "0xD09fae2C61D9Da588D92d53bE28892965Cfcc984",
      "pk": "0x9381b2207d5d85f5d282eaf12e561b258cdad053a97508a90db847c1d6aa101d"
  },
  {
      "address": "0xB9CF3bF8C8cfdaC39b939754B47F3D3711D3e3C0",
      "pk": "0x932f7946c086aa106518956c41a4cc31dedf1009b5406e0b947090cc1941accd"
  },
  {
      "address": "0x507fBf748EB37af8ABb7A8f882bDFaCd66fc48eb",
      "pk": "0x6fe56b58dfad94d403531592b13bd8867d7745b96503d6503126f96b4217c6f6"
  },
  {
      "address": "0xf4AC4a2FF17C7125c78A8b9c5085Bbe7Ef3dF592",
      "pk": "0x191472993850a73d1ff3a46dbadf63e94c97adc552c7fd97b96dd581c73d0dff"
  },
  {
      "address": "0x4CB1E4fF455f881e75ED84794516Eb44E099a91e",
      "pk": "0xbcbda3289518a5b61ddb419e7e90f4ba113cd0c6dc64d56b7486e91598a00ecb"
  },
  {
      "address": "0x5D14eB78701D868720533bD266c6a3c813192ab7",
      "pk": "0x0e93eb20399c774aa60efc4a8e3f9b5ba10f576d8a4bf6ab93deb4317892fdcf"
  },
  {
      "address": "0xb6040225d71e13CdC5Eb988f8F209f9C8F89A95E",
      "pk": "0xa6032d212184ee2b8d95176b6af9b2da0cd3d3708ac39d4a39221462c2448026"
  },
  {
      "address": "0xC36cF64b24cA7f8B3bdfF3600B7c130C63Cd6Bd2",
      "pk": "0xc026147d94fd773322f1eefcf1ae5abcc6cb81d16bdbebb836956a0f428240b0"
  },
  {
      "address": "0x5ee7D02C200BbaDb0186874e2C59720c2208AAc6",
      "pk": "0xd138f9e20e1e21a13290d13f6d0ab1202d342da72df9a49dde08704ef7849b81"
  },
  {
      "address": "0x55DFf32E5113332301443141CF42368C77eF1F8c",
      "pk": "0xd0f513f21f54086372b2589e609b36f22d75619352e1f0b9b1d0a278ab497596"
  },
  {
      "address": "0xbba1AEf49ac44abe7113300Ebe66C86e04350271",
      "pk": "0xce4920e8ed57dddc582d9a1ea5fd0e34b75d0cb37faa4cce00a91faa02deda84"
  },
  {
      "address": "0x7a1b84C5350462114660315b4E0901eB147f36A5",
      "pk": "0xc576f57bd1c1d3f85668886637b2da2bd58b8dd683eac76af23fd50d823fa895"
  },
  {
      "address": "0xf8f0DE0A8A7f881f8726C868b16cc128589f9f8B",
      "pk": "0x22e2b3ab56e3245f4e203d2e393f4a9f9be18b1683bff468f0b5ee56a3d5b892"
  },
  {
      "address": "0x85c1e47EE99379954c49B6eEF2579f96d6960d02",
      "pk": "0x17564c63d0bde6ad5c3e4d871d7447bdf395e8841aa67819975bb42d8d7bc4f1"
  },
  {
      "address": "0x30a970deb27c92AF6ab8959318F32c9730bc252e",
      "pk": "0x1bfc9473a1c520278de7582d4f1d3365e7f5807a047645cdfb9df6d63d09a491"
  },
  {
      "address": "0x153D59a7D112fCE6B9138AE33f98e7020FAA349e",
      "pk": "0xc2ba14c39f866f0c84ccb0fdd23e825060685ba26090185b3bc7539302fb5f69"
  },
  {
      "address": "0x327D370CD3a8511821Fb9BaF2FdFE629357d4b8e",
      "pk": "0x57110691c10f76fad0ba191ceea6b023245082287674d286edd1e07df31347ae"
  },
  {
      "address": "0x10c906195de02B09Bc29145934D7e857d60f6C72",
      "pk": "0xa1ade47508ecbddd11e99abb35af5c831d23e766207f5f5fbd946b1acc5d80e0"
  },
  {
      "address": "0xdD850e36810cB50bbA39ECf9fFc6ca43538BE89B",
      "pk": "0xbbf375597bd4c9fd801d9fcb1e0b6fef5994887f072509f5fafb96e8f0917a2b"
  },
  {
      "address": "0xF3A5ec608760513547b46a2f14B10B7824DF2122",
      "pk": "0x1e3a3bd5c322085e5f892486a53a9ed8835e9d6b7b28ff1fd8f4ee1b173f56a0"
  },
  {
      "address": "0xAeA484d9e94883B6710320062A7ce3Ab8ccBC550",
      "pk": "0x1b3919dc6e01330221a1c908901edadb8bcd71c057d4f01e4f01290b9f7ee290"
  },
  {
      "address": "0x1572c07D85D1616dc7DC7E73f49d538D68111660",
      "pk": "0x7c0983dd45e24504980ba7bcf1ae2b54082ffb79301abc00d770c571e1ec163a"
  },
  {
      "address": "0x6dCB29711367855317a34D413f8fcC18A0Cdc278",
      "pk": "0x1ee1bf9670676a2c9347cbed4d29745cad967712c33eaa3a6aded183b0212726"
  },
  {
      "address": "0xCB53c99459f10DcCcf9003934915898a66a6cc65",
      "pk": "0xc6f5f89d5ed4d58ec60ab79ee0a172707b9fa15d503b5df605cb8833dbd92d0d"
  },
  {
      "address": "0xc6F01a7acaF6A764ab67dEf27EadC9f815422E28",
      "pk": "0x031e90b4cfbbb3ebaf83f75b0a8a163f6e095a0be998a4b741e2a29500ef5b11"
  },
  {
      "address": "0x725305A8A7a40BECEA25E4798c7ebC5a3545997E",
      "pk": "0x5c4846003d34860dab4be19ef70e97a8898d36c78c278a5785c01b27f8d91192"
  },
  {
      "address": "0xCFaaDA4Ba4f37F9ADE49f342fea4f9e38a68a719",
      "pk": "0xfe87ee2e472fa1a3bb8320dfb0271998b2dff9ae625b2cb75f7262898fb78732"
  },
  {
      "address": "0xC8c9f7E74aEe294Afeb3c4E308BcabA83C6E04D6",
      "pk": "0xcba664f8e0455ade3a1f1ae4b52a21c7ebca472447256ea200ba65c6051825ca"
  },
  {
      "address": "0x81719E97D47244a48B30b62C485271D5b9f2B4De",
      "pk": "0x7d57f227fda4178d8eeb9eb4f430fde5c27daed8a7c8718ed5f8c605700b0a2c"
  },
  {
      "address": "0x9E2F5bF5dC74b6a75cC6Ef450Db4D9Ba401De1a2",
      "pk": "0xe9e20701ae300971fa7106925536a47e67407eb4e3cc5f42f9a25cba4b7c273e"
  },
  {
      "address": "0x50FD97aABb7D53105968604BaB3375dA08B68fA6",
      "pk": "0x1ab7df0566d064d535f284ee27e407ce90ebc97afbdc14dce9ba239598ecc8a1"
  },
  {
      "address": "0xC2F958666677b015Ed86a300309dC6Fe4C030565",
      "pk": "0x16e00d0855c18197646dd31955b2f89bf0b1b7713f5dddba7c9b4fd362f40306"
  },
  {
      "address": "0x251A36173886b49C80469fC3F15444b755ED5b12",
      "pk": "0x274da1248f3cc1adb6fe8f153c408743c1b3103320218d5697796da6195f5653"
  },
  {
      "address": "0x11D9E783138b6452518F07edad59139927a6af77",
      "pk": "0xb7f8de661d8564fb2bd596610cedb783df701e098154cfd787e1a0e64704c165"
  },
  {
      "address": "0x840694FE06938Cc1c4dFEf9Da37DEa7f082FA97e",
      "pk": "0x63857f18851be29a0eac59aa19c724e3c72229763448b691c8e0e075dd52bb8b"
  },
  {
      "address": "0xbe92aCDa6E4e21979c887eC2af19F21faF041A78",
      "pk": "0x70e80be579ed04e9cdefc0e27839ee637ce1f4912385cee9b004e31390afd58a"
  },
  {
      "address": "0xc294596024B45ff7c86BDa631B4774d554869aB5",
      "pk": "0xd16c6aa958f6603992ad4259efc5a732f5c027a1ab4b479b5c3eb162f5910d4c"
  },
  {
      "address": "0xd2a8DBFBC76A82b922D9393498E89e146A24709e",
      "pk": "0x64a7a0ad33a4c9ddbfae1bf192afd65a0fd0c104e829831a959696b6e4443a9b"
  },
  {
      "address": "0x66D52F31255E105BF3C48DB8B45542fFDB615f2c",
      "pk": "0x7ced5e966293841e189aaca2d54b9f3b694353df452bf8f024ed7e116eec0584"
  },
  {
      "address": "0xcB9dB204eE1bE280DbB0E9e3f86E3a31cF430Cbb",
      "pk": "0x99159b88106ffea428507d55b4b075b6baf5eff7848391a06c334b9430217fc2"
  },
  {
      "address": "0x83fe2aeD2e22e237cA47A553780E5520b05cCE66",
      "pk": "0xb7c3a3d6928f1e426f646c9cf70bbce8181a6dfaf62b62d9388ab42009e7b6d8"
  },
  {
      "address": "0x82825D2903959d67Ff01588f63591e125C99ceCA",
      "pk": "0x4edca9eb7a286b464f68142f08a17fdd37128e033420097005f9235086fd1ca4"
  },
  {
      "address": "0x970cF22f187dEdC008ebf73CBa1edF3D4bf382b0",
      "pk": "0x75a8369d4a7abd3a2c156e69bbb0a4a9650b8ef75bdc69efa05f2aa3fd8aa642"
  },
  {
      "address": "0x9Efb4680275CFCd8B797d10a56BEA1427104548a",
      "pk": "0x8c0f87bb1dac0e9dcfe9b395b2c4488010da5914295057ad21f98cb2ba2d89db"
  },
  {
      "address": "0xc38CF970643aCc4a48b2c2Bdfb0F8c8B8B66D769",
      "pk": "0xd5be0402843b97eb51a5914f01e4fcff36f0668b8888b41dc6a6625b3efe427d"
  },
  {
      "address": "0xd00d518b7Ba2C3DcC79BF8e167146B4cB7Cd7e49",
      "pk": "0xdcc4cd15e014ba1b175c656c94734158886e6c5adca792b202855ff3696c7acf"
  },
  {
      "address": "0x393B2c369BE338bbeDB400cbb14b9364014c7CC0",
      "pk": "0xe18f97791ab5b3d27948d9fa6ef49c0345803a356b271f45adf56ddfca8ac6e0"
  },
  {
      "address": "0xE1B5645D049829Ff67079bBc0b24AA509D63cfcb",
      "pk": "0xfbc6746dd3c4f986237815991e9225a3a33bb7ad26851dc5d069da4174beccde"
  },
  {
      "address": "0xeC741Da886B902912935B1eD645ccDD9abFFD80a",
      "pk": "0x544b8742a66f0f5ce9d12084b72d9104e836ae17b4c8c41c67f63a0ac0ec4caf"
  },
  {
      "address": "0x7a6C0a3B260C7235d51fD89D533917F9Ecf0B45f",
      "pk": "0x701c64588b59079bdda85c539371485892076be27865e534456280c8f121e83f"
  },
  {
      "address": "0xa362AdD6f3D159e3aC3f259E54E3c156564Ce290",
      "pk": "0x349d3f6c2ef6bdf30a5cbb930ee930686c874f1d337839aec11c4c5dc4797044"
  },
  {
      "address": "0xc6a5C5246Fa2e67C340C791096cF0adFF881eC0F",
      "pk": "0xb5c2f98554d78f73a606fa5767b7510f874b5f3684274f7f7bdb600bd54adfe0"
  },
  {
      "address": "0xc4DfAf055bbCFA1E5180De50c2ECB9C01B942E5d",
      "pk": "0x397d819810e18854048bbf96d16a9374c76be9f2d11f5b40bfc0fbb34ad9e1ca"
  },
  {
      "address": "0xdF6B2ebEF9DBEA76584cAe30aAB6AD1735291A5F",
      "pk": "0x69470d8682ed23fc3db643955191984b856ed88c5ca76b607926b7dd672c6a14"
  },
  {
      "address": "0x685e78eAC72846871b2e4D7D809987D0184D24be",
      "pk": "0xdd8862c67b6bf6cf4e72743519ce695e51f432d88b6b96d79cb86b4bb898c245"
  },
  {
      "address": "0x14D8023ea867e0f36A3c58cbe9d367a73A9E7254",
      "pk": "0x9f1b808f872899f88c2ece1bb98d825a01edd9c1257628f9d2c6dbb478a5f319"
  },
  {
      "address": "0x8f3217C87415fFFB6D5bAAaE3eE51Ef3F1F22a6a",
      "pk": "0x3d9dec78400fd5bccf043e93a3f25dd2f34b0fe677e17bd2396bf6931a6a11c5"
  },
  {
      "address": "0x90cca49A49Ff03A7ad87E3bf365276649e277724",
      "pk": "0xe2263f84912b62f512215c6daeece8b0bc0e57797e7754fab008f848e2d549f2"
  },
  {
      "address": "0x491e72A62683c3DB81Fb534F7f5b5bE884825339",
      "pk": "0x85e77828f15c4bae6c1e308be8ac3057260e4f75759980e83784d4dfde7022c2"
  },
  {
      "address": "0xC4be7323b26cff85d7b7958bf33b1506B846AE92",
      "pk": "0x434b44c21b11d34a453f8369100a904fdc0c442a37d7f7e5477564e7d6dc43cf"
  },
  {
      "address": "0x02c3fa5481310e784ce8D201d6DE576684693F27",
      "pk": "0xda119b07e76fd9d673fd48d30e5815623a3cc6e1428b5f84731b856308c07a20"
  },
  {
      "address": "0x63e2d5dA064f2426D9179B3B702e1aa4eE6863a4",
      "pk": "0x62c0039260d728f307551b55caab82d4f97353b0276caee463b3b42bf5f65ba8"
  },
  {
      "address": "0x83081E4D2e6cC579d3B33D72Cc31228fbE91FA1F",
      "pk": "0x4ca639fa9a192259021afc247403627739c15bab801b8d18b1adad05369e107c"
  },
  {
      "address": "0x921055342A23ED377EadD5e299740016ab5abbEb",
      "pk": "0x2de3e0e2b4b19560b7132cd0a2f7b7b84d3a32ed42b01b0b39ec74057f151fab"
  }
];

// Initial Setup
let web3 = new Web3(RPC_URLs[index]);
let contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

const safeStringify = (obj) =>
  JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
);

function sleep(ms) 
{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function changeRPC()
{
    index = index + 1;
    if(index == 4)
    {
        index = 0;
    }
}

async function callRewardNTimes() {

  const gasPrice = web3.utils.toWei("40", "gwei");

  console.log("RPC: ",RPC_URLs[index]);
  let timeBefore = Date.now();
  console.log("Timestamp before: ",timeBefore);

  for (let i = 105; i < 140; i++) {
    try {
      let account = web3.eth.accounts.privateKeyToAccount(wallets[i].pk);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;

      //console.log(account.address);
      let tx = contract.methods.reward(AMOUNT_TO_REWARD);
      let promise = tx.send({
        from: account.address,
        gas,
        gasPrice,
        nonce
      });
      txHashes.push(promise);
    } catch (err) {
      console.error(`❌ Tx ${i} failed:`, err.message);
    }
  }
  console.log("Fire all contract interaction transactions at once ...");
  //Fire all transactions at once
  const results = await Promise.allSettled(txHashes);
  console.log("All transactions fired at once... ✅");

  console.log("Checking all fired transactions responses: ");
  let flag = 0;
  results.forEach(async(res, i) => {
    if (res.status === "fulfilled") {
      console.log("TX " + i + ": ✅ Sent! Hash: " + safeStringify(res.value.transactionHash));
    } else {
      console.log("TX " + i + ": ❌ Failed - " +safeStringify(res.reason));
      flag++;
    }
  });

  if(flag >= whenToChangePort)
  {
    await changeRPC();
    web3 = new Web3(RPC_URLs[index]);
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  }

  txHashes = [];
  nonce = nonce + 1;
  console.log("nonce increased: ",nonce);

  let timeAfter = Date.now();
  console.log("Timestamp after: ",timeAfter);

  let timeToWait = 1000 - (timeAfter - timeBefore);
  console.log("Time to wait: ",timeToWait);
  if(timeToWait >= 0)
  {
    await sleep(timeToWait);
  }
  callRewardNTimes();
  return;
}

const main = async () => {
  try {
    await callRewardNTimes();
  } catch (error) {
    console.log("Main function error: ",error);
  }
};

main();
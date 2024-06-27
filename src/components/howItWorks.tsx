import Link from 'next/link'

export default function HowItWorks() {
  return (
    <article className="p-10 flex flex-col gap-3 text-white">
      <h4 className="font-russo">How Does It Work?</h4>
      <p>
        This migrator tool let’s you migrate your Eth mainnet Battle Derby
        Passes to the Immutable zkEVM.
      </p>
      <p>
        You have your Battle Derby Pass nfts in your Externally Owned Account
        (EOA) wallet (ETH mainnet). So you can migrate these to your Immutable
        Passport on Immutable zkEVM (mainnet).
      </p>
      <p>
        First you need to connect your EOA wallet which you owned Battle Derby
        Passes in. Then you need to connect your Immutable Passport to the
        migrator and confirm the origin wallet and the destination wallet.
      </p>
      <p>
        Once you confirmed your wallet map, you can not change it later. You
        need to be sure of your origin and destination wallets. Wrong or
        unintentional wallet address can be result in even loss of your Battle
        Derby passes. So you have to connect your wallet cautiously and double
        check it.
      </p>
      <p>
        For confirming your wallet map, you need to sign a message with your
        wallet and send it to our server to verification. When your wallet map
        is verified, you are ready to start migrations of your nfts.
      </p>
      <p>
        You will see your Battle Derby Passes with “burn” buttons. First you
        need to burn your Battle Derby Passes in ETH mainnet. You have to pay
        the burn transaction total cost, including the gas fees. When we
        detected a successfull burn action by your wallet by using your wallet
        map, we are going to mint your new nft on Immutable zkEVM.
      </p>
      <p>
        When you burn your nfts, you are going to see they removed from your EOA
        wallet list; when a new nft is minted for burned one you are going to
        see it on your Passport wallet.
      </p>
      <p>
        After you burn your ETH mainnet nfts for migration, new minting can take
        a few minutes to be processed.
      </p>
      <p>
        If you encountered any issues other than these guidance, please contact
        with our technical support{' '}
        <Link className=" underline" href={'mailto:support@tripleogames.com'}>
          support@tripleogames.com
        </Link>
        .
      </p>
    </article>
  )
}

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
  <Link href={'/'} >
      <div className='flex items-center space-x-2'>
    <Image src='/logo2.svg'width={28} height={28} alt=" " />
      <Image width={130} height={130} src='/logo.svg' alt="logo"/>
    </div>
  </Link>
  )
}

export default Logo
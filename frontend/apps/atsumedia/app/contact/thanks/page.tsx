
import Link from "next/link";
import CommonFooter from "../../(main)/_components/CommonFooter";


export default function Page() {
  return (
    <>
      <div className="bg-[#eee] p-0 md:py-[40px] md:px-[1.5em]">
        <div className="max-w-[1000px] my-0 mx-auto bg-white py-[10em] px-[1em] md:p-[50px] text-[80%] md:text-[100%]">
          <p className="leading-loose">
            お問い合わせは送信されました。<br />
            営業時間外のメールでのお問い合わせは、返答までお時間がかかる場合がございますので、あらかじめご了承ください。<br />
            引き続きあつめでぃあをよろしくお願いいたします。
          </p>
          <div className="text-center">
            <Link href={'/'} className="inline-block mt-[2em] hover:underline text-[rgb(68,136,221)]">TOPへもどる</Link>
          </div>
        </div>
      </div>
      <CommonFooter />
    </>
  )
}

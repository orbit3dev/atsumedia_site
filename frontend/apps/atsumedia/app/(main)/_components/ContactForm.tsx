"use client";
import Script from "next/script";
import CommonFooter from "../_components/CommonFooter";
import { useCallback } from "react";

const ContactForm = () => {
  const onLoadFormrun = useCallback(() => {
    (window as any).Formrun?.init('.formrun')
  }, [])

  return (
    <>
      <div className="md:bg-[#eee] md:py-[40px] md:px-[1.5em] p-0">
        <div className="md:max-w-[1000px] md:my-0 md:mx-auto md:bg-white md:p-[50px] md:[counter-reset: number 0] p-[1em] text-[80%]">
          <div className="text-base mb-[2em] leading-normal">
            <p className="font-bold">個人情報の取扱いについて</p>
            <ul className="text-sm list-disc pl-[1.5em]">
              <li className="my-[8px]">フォームにご記入いただいた個人情報は、本サービスに係る個人データとして株式会社静岡新聞社、静岡放送株式会社、一般社団法人未来のテレビを考える会、株式会社ニュートラルワークスの間で共同利用し、問合せへの対応に利用いたします。</li>
              <li className="my-[8px]">また、お客様サービス向上のため、個人を特定しない仮名加工情報として今後の企画立案にも利用させていただきます。</li>
              <li className="my-[8px]">お客様の個人情報を、ご本人の同意なしに第三者に開示・提供することはございません（法令等により開示を求められた場合を除く）。</li>
              <li className="my-[8px]">
                共同利用する個人データの管理責任者は以下のとおりです。<br />
                〒422-8033 静岡県静岡市駿河区登呂3-1-1<br />
                株式会社静岡新聞社 代表取締役 大須賀紳晃（担当窓口：事業変革推進室）
              </li>
            </ul>
          </div>
          <Script onLoad={onLoadFormrun} src="https://sdk.form.run/js/v2/formrun.js" />
          <form className="formrun" action="https://form.run/api/v1/r/u70wmgc2ih3ygw74ugzzpy57" method="post">
            <div className="mb-[2em]">
              <label className="block bg-[#ddd] py-[0.2em] md:py-[0.3em] px-[0.5em] md:px-[0.8em] rounded-[5px] font-bold leading-[1.5em] md:leading-[2em] mt-[1.5em] mb-[0.8em] md:my-[0.8em]"><span className="bg-[#666] rounded-[2em] w-[1.5em] md:w-[2em] h-[1.5em] md:h-[2em] text-center mr-[0.3em] md:mr-[0.5em] text-white font-normal inline-block">1</span>メールアドレス<span className="text-[#e00] ml-[5px]">*</span></label>
              <p className="text-[#555] text-[0.9em] pl-[7px] relative my-[0.3em] ml-[14px] before:content-['※'] before:absolute before:left-[-8px]">担当部署から返信させていただく場合がありますので、迷惑メール対策としてドメイン指定受信をされている方は、「@atsumedia.com」を受信できるよう設定してください。</p>
              <input className="box-border p-[0.5em] border border-[#ccc] rounded-[5px] w-full" name="メールアドレス" type="text" data-formrun-type="email" data-formrun-required />
              <div className="text-red-500 mt-1 text-sm" data-formrun-show-if-error="メールアドレス">メールアドレスを正しく入力してください</div>
            </div>

            <div className="mb-[2em]">
              <label className="block bg-[#ddd] py-[0.3em] px-[0.8em] rounded-[5px] font-bold leading-[2em] my-[0.8em]"><span className="bg-[#666] rounded-[2em] w-[1.5em] md:w-[2em] h-[1.5em] md:h-[2em] text-center mr-[0.3em] md:mr-[0.5em] text-white font-normal inline-block">2</span>件名<span className="text-[#e00] ml-[5px]">*</span></label>
              <input className="box-border p-[0.5em] border border-[#ccc] rounded-[5px] w-full" name="件名" type="text" data-formrun-required />
              <div className="text-red-500 mt-1 text-sm" data-formrun-show-if-error="件名">件名を入力してください</div>
            </div>

            <div className="mb-[2em]">
              <label className="block bg-[#ddd] py-[0.3em] px-[0.8em] rounded-[5px] font-bold leading-[2em] my-[0.8em]"><span className="bg-[#666] rounded-[2em] w-[1.5em] md:w-[2em] h-[1.5em] md:h-[2em] text-center mr-[0.3em] md:mr-[0.5em] text-white font-normal inline-block">3</span>内容<span className="text-[#e00] ml-[5px]">*</span></label>
              <textarea className="box-border p-[0.5em] border border-[#ccc] rounded-[5px] w-full" name="お問い合わせ" rows={7} data-formrun-required></textarea>
              <div className="text-red-500 mt-1 text-sm" data-formrun-show-if-error="お問い合わせ">お問い合わせ内容を入力してください</div>
            </div>

            <div className="absolute h-[1px] w-[1px] overflow-hidden">
              <label htmlFor="_formrun_gotcha">If you are a human, ignore this field</label>
              <input type="text" name="_formrun_gotcha" id="_formrun_gotcha" tabIndex={-1} />
            </div>

            <div className="text-center">
              <button className="mb-[1.5em] md:mb-0 mt-[2em] p-[0.5em] text-black text-[1.2em] text-center bg-[#fb0] shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-[5px] border-0 font-bold w-2/4 hover:bg-[#e80]" type="submit" data-formrun-error-text="未入力の項目があります" data-formrun-submitting-text="送信中...">確認する</button>
            </div>
          </form>
        </div>
      </div>
      <CommonFooter />
    </>
  )
}

export default ContactForm;

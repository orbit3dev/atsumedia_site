import ContactForm from "../(main)/_components/ContactForm"

export const metadata = {
  title: 'お問い合わせ | あつめでぃあ',
  description: 'あつめでぃあのお問い合わせページです。『あつめでぃあ』は動画配信情報や放送日、キャスト/声優/原作者/制作会社などの番組情報を掲載している@S[アットエス]が運営する総合メディア情報サイトです。',
  openGraph: {
    title: 'お問い合わせ | あつめでぃあ',
    description: 'あつめでぃあのお問い合わせページです。『あつめでぃあ』は動画配信情報や放送日、キャスト/声優/原作者/制作会社などの番組情報を掲載している@S[アットエス]が運営する総合メディア情報サイトです。',
  },
}

export default function Page() {
  return <ContactForm />
}

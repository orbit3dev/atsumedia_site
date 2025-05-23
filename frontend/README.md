# 環境
## 検証環境
### ユーザー画面
https://dev.d3lpyf0nhbpqh3.amplifyapp.com/ \
User: test \
PW: atsu@at-s.com
### 管理画面
https://dev.d3fgteqpo9hwmz.amplifyapp.com/sign-in \
Email: admin@gmail.com \
PW: TARA社 or 運営側に問合せ
## 本番環境
### ユーザー画面
https://main.d3lpyf0nhbpqh3.amplifyapp.com/
### 管理画面
https://main.d3fgteqpo9hwmz.amplifyapp.com/sign-in \
Email: admin@gmail.com \
PW: TARA社 or 運営側に問合せ

# ブランチ
- test: 開発用ブランチ
- dev: 検証環境へ反映するブランチ
- main: 本番環境へ反映するブランチ

最新ソースコードを上記のブランチへマージしたらそれぞれの環境へ自動的に反映されるように設定済み

# ディレクトリ構造
```
atsumedia
  |_ apps <= フロントエンド
    |_ admin <= 管理画面
    |_ atsumedia <= ユーザー画面
  |_ libs <= バックエンド
    |_ amplify-backend <= バックエンド
    |_ amplify-client <= フロントエンドから引用
```

# Backend(Sandbox)起動
## 準備
- IDE
  - WebStorm薦め
- ソースコード
  - 本RepositoryをClone
  - devブランチへ切り替え
- AWS access portalでログイン
  - https://d-95675f9b10.awsapps.com/start/#/?tab=accounts
    - アカウントは開発チームへ連絡して発行
    - 開発者は`AmplifyBackendFullAccess`でログインする
- Node.jsバージョン
  - Node: 18.18.0+
## 起動
本RepositoryのRootに入って下のコマンドを実行
  ```
  npm install
  ```
エラーログがないことを確認
  ```
  cd libs/amplify-backend
  ```
  ```
  npm install
  ```
エラーログがないことを確認

AWS access portal でアクセスキーを環境変数としてコピーし、ターミナルにペーストする

例
```
export AWS_ACCESS_KEY_ID="xxxxx"
export AWS_SECRET_ACCESS_KEY="xxxxxxx"
export AWS_SESSION_TOKEN="xxxxxxxxx"
```

下記コマンドの`admin-test`の部分を適切に修正して実行(自分の名前など)
```
npx ampx sandbox --identifier admin-test
```

サンドボックスがDeployされるまで数分間待ってログにエラーがないか確認、エラーがなければバックエンドの反映は成功

# Frontend起動
## admin起動
- バックエンドの起動ログから`userPoolId = `を検索して値をコピー
- AWSコンソールからCognito管理ページに入ってコピーしたuserPoolIdで検索
- 該当userPoolをクリックして中に入ってAdminログイン用のユーザーを生成
  - （生成する時シンプルにEmailだけ使ってログインできるように設定）
- 生成したユーザーをADMINSグループに追加
- 
  ```
  npm run admin
  ```
- 起動にエラー情報がなければブラウザーで`http://localhost:4200`へアクセス
- ログイン画面が表示したらCognitoのユーザープールに生成したアカウント情報を入れてログイン
  - 初期ログインしたらパスワード変更が必要
- ログインした後、それぞれのメニューを使って下記リンク内データをCSVへ導出したファイルをアップロード（下の順番にアップロード）
  - カテゴリ：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=667836453#gid=667836453
  - 放送局：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=2063183715#gid=2063183715
  - キャスト：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=1335074028#gid=1335074028
  - シーズン：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=1602446227#gid=1602446227
  - Vod：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=83986235#gid=83986235
  - 曲：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=1787269046#gid=1787269046
  - 制作会社：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=1727430165#gid=1727430165
  - 作品：https://docs.google.com/spreadsheets/d/1L-jlw-H68oz0EB5c9dtPe45oxjXMGxDcDEa2ACVsR4Q/edit?gid=0#gid=0
  - ページ表示設定：https://docs.google.com/spreadsheets/d/1186xnHCCXmHDrnWfLa6I7ktA1RoHIPLjbyR03j0B2s0/edit?gid=2120160342#gid=2120160342
  - ニュース：入力フォームを使って１件ずつ入力
- 作品画像のアップロード 
  - バックエンドの起動ログから`bucketName = `を検索して値をコピー
  - [Cyberduck](https://blog.usize-tech.com/uploads3-by-cyberduck/)ツールを使ってS3へ接続
  コピーしたbucketを捜して中に入る
    - 接続情報は谷さん or 運営チームに問合せ
  - `public`というRootフォルダーを作って中に入る
  - 作品画像やキャスト画像などを(フォルダー構造を維持しながら)`public`フォルダー内にアップロード

## atsumedia起動
```
npm run app
```
起動にエラー情報がなければブラウザーで`http://localhost:4200`へアクセス

# その他
## 画面表示エラー
サンドボックスはCookieベースで認証しているので、atsumediaとadminのCookieが互いに影響を及ぼすためCookieをクリアしたら正しく表示

Chromeのプラグインが原因でページ表示エラーとなることがあります。エラーの原因がわからないときは無効化してみてください。


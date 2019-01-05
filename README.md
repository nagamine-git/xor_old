# Xor

## Webクライアントの使い方

### 事前準備
```bash
cd web_client/xor #Webクライアントはここに設置してある
yarn #パッケージインストール
sudo npm install -g firebase-tools #firebaseが入ってない場合、firebase-toolsをインストール
firebase login #firebaseでデプロイできるよう、ログインする
```

### 普段使うコマンド
```bash
yarn dev #開発環境で立ち上げ（localhost:3000で見れる）
yarn lint #eslintをかける
yarn lint --fix #lint自動修正
yarn deploy #ビルドし、firebase hostingでデプロイ
```
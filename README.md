# LIFF + Next.js + Supabase Authentication Sample

このリポジトリは、LIFFアプリケーションにおけるNext.jsとSupabaseを使用した認証フローのサンプル実装です。
Blogは[Qiita: LIFFとNext.js, Supabaseを組み合わせる](url)または、[原文: LIFFとNext.js, Supabaseを組み合わせる](blog_ja.md)をご覧ください。

実際の動作例は以下のLINE Botで確認できます：
https://line.me/R/oaMessage/@807rpwtd

![QRコード](https://example.com/qr.png)

## 機能

✅ LINEアプリからの起動時の自動ログイン
✅ ブラウザからアクセスした際のLINEログインへの誘導
✅ ログイン後の元のページへのリダイレクト
✅ 開発環境でのモックログイン

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [LIFF SDK](https://developers.line.biz/en/docs/liff/overview/) - LINE Front-end Framework
- [Supabase](https://supabase.com/) - バックエンド・認証基盤
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発

## セットアップ

1. 環境変数の設定:

```bash
cp .env.sample .env.local
```

以下の環境変数を設定してください：
- `NEXT_PUBLIC_LIFF_ID`: LIFFアプリのID
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー

2. Supabaseのセットアップ:

```bash
# Supabaseプロジェクトの起動
supabase start

# マイグレーションの実行
supabase migration up
```

3. 依存関係のインストール:

```bash
npm install
# or
yarn install
```

4. 開発サーバーの起動:

```bash
npm run dev
# or
yarn dev
```



## ライセンス

Apache-2.0

## コントリビューション

Issue、PR大歓迎です！

#!/bin/bash

export AWS_ACCESS_KEY_ID="XXX"
export AWS_SECRET_ACCESS_KEY="XXX"
export AWS_BUCKET_NAME="XXX"
export AWS_CLOUDFRONT="XXX"
export AWS_DEFAULT_REGION="XXX"

# nvm（node version manager）を読み込み、node（.nvmrc 内のバージョン）をインストールし、npm パッケージをインストールします。
[ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh" && nvm use
# まだインストールされていない場合は npm をインストールする
[ ! -d "node_modules" ] && yarn install

yarn run generate
# yarn build
gulp deploy

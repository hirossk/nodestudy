console.log("--- 非同期処理のサンプル ---");

// 1. Promiseを返す関数の定義
// この関数は、指定された時間(ms)が経過した後に「成功」するPromiseを返します。
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      // 指定時間が経過したら、Promiseを成功状態にする
      resolve(`- ${ms}ms 経過しました`);
    }, ms);
  });
}


// 2. async/await を使って非同期処理を呼び出す
// `async` キーワードを関数の前につけることで、この関数が非同期処理を含むことを示します。
async function main() {
  console.log("処理を開始します。");

  // `await` キーワードは、Promiseが解決される（処理が終わる）まで、ここで待機します。
  // `await` は `async` 関数の中でのみ使用できます。
  const result1 = await wait(1000); // 1000ms = 1秒 待つ
  console.log(result1);

  const result2 = await wait(2000); // さらに 2秒 待つ
  console.log(result2);

  console.log("すべての処理が完了しました。");
}

// 作成したasync関数を実行
main();
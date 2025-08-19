
console.log('--- 1. 基本的な関数 ---');
// 'name'という引数を受け取る関数を定義
function greet(name) {
  return 'こんにちは、' + name + 'さん！';
}
// 関数を呼び出し、結果を変数に格納
const message = greet('田中');
console.log(message);

console.log('\n--- 2. 関数を変数に入れる (関数式) ---');
// 無名関数を定義し、変数'myFunction'に代入
const myFunction = function(name) {
  return 'Hello, ' + name + '!';
};
// 変数名で関数を呼び出す
console.log(myFunction('Suzuki'));


console.log('\n--- 3. 関数を引数にする (コールバック関数) ---');
// 第2引数でコールバック関数を受け取る
function executeSomething(value, callback) {
  console.log(`これから渡された処理を実行します。値: ${value}`);
  const result = callback(value); // 受け取った関数を実行
  console.log(`処理の結果: ${result}`);
}
// 実行させたい処理を関数として定義
const double = function(num) {
  return num * 2;
};
// 関数'executeSomething'に、値'10'と、関数'double'を渡す
executeSomething(10, double);


console.log('\n--- 4. コールバックと非同期処理 (setTimeout) ---');
console.log('1. 処理を開始します');
// 2秒後に実行してほしい処理を、無名関数として直接渡す
setTimeout(function() {
  console.log('2. 2秒が経過しました（このメッセージは最後の方に出ます）');
}, 2000);
console.log('3. setTimeoutの依頼は完了しました。');


console.log('\n--- 5. アロー関数 (コールバックを短く書く方法) ---');
// 上のsetTimeoutをアロー関数で書くとこうなる
setTimeout(() => {
  console.log('-> 1.5秒経過しました (アロー関数版)');
}, 1500);


console.log('\n--- 6. async/await (現代的な非同期処理) ---');
// Promiseを返す関数
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
// async関数を定義
async function run() {
  console.log('-> async処理開始');
  await delay(1000); // 1秒待つ
  console.log('-> 1秒経過');
  await delay(1000); // さらに1秒待つ
  console.log('-> 合計2秒経過。async処理完了です。');
}
// async関数を実行
run();

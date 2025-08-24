CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータ
INSERT INTO tasks (title, completed) VALUES ('Node.jsの勉強', false);
INSERT INTO tasks (title, completed) VALUES ('Expressの復習', true);


docker build -t my-mariadb .

docker run -d \
  --name mariadb-todo \
  -p 3306:3306 \
  my-mariadb

-- mysql clientのインストール
sudo apt install mariadb-client-core 
-- ログインする
mysql -u root -p -h localhost -P 3306
<?php
// エラー報告を有効にする
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 許可するオリジンのリスト
$allowed_origins = ['http://localhost:3000'];

// オリジンを確認してCORSヘッダーを設定する
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// プリフライトリクエストを処理する
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database connection　→データベース接続
$db_conn = mysqli_connect("localhost", "root", "", "reactphp");

// 接続を確認してください
if ($db_conn === false) {
    logError("Database connection failed: " . mysqli_connect_error());
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

// エラーをログに記録する機能
function logError($message) {
    error_log($message, 3, 'errors.log');
}

// リクエストメソッドを取得する
$method = $_SERVER['REQUEST_METHOD'];

switch($method)
{
    case "GET": 
        $path = explode('/', $_SERVER['REQUEST_URI']);

        if (isset($path[6]) && is_numeric($path[6])) {
            echo "Get Api Single Row"; die;
        } else {
            $allproduct = mysqli_query($db_conn, "SELECT * FROM productdata");
            if (mysqli_num_rows($allproduct) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($allproduct)) {
                    $json_array["productdata"][] = array(
                        "id" => $row['pid'], 
                        "pday" => $row["pday"],
                        "ptitle" => $row["ptitle"],
                        "pprice" => $row["pprice"],
                        "pimage" => $row["pfile"],
                        "status" => $row["pstatus"]
                    );
                }
                echo json_encode($json_array["productdata"]);
            } else {
                echo json_encode(["result" => "
データを確認してください"]);
            }
        }
        break;

    case "POST":// ファイルがアップロードされたか確認
        if (isset($_FILES['pfile']) && $_FILES['pfile']['error'] === UPLOAD_ERR_OK){      
            $pday = $_POST['pday'];
            $ptitle = $_POST['ptitle'];
            $pprice = $_POST['pprice'];
            // ファイルの情報を取得
            $pfile = time() . basename($_FILES['pfile']['name']);
            $pfile_temp = $_FILES['pfile']['tmp_name'];
            $pstatus = isset($_POST['pstatus']) ? $_POST['pstatus'] : 1; // デフォルト値を設定する
    
             // データベースに挿入する準備
            $stmt = $db_conn->prepare("INSERT INTO productdata (pday, ptitle, pprice, pfile, pstatus) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssisi", $pday, $ptitle, $pprice, $pfile, $status);
            // 挿入を試行
            if ($stmt->execute()) {
                // ファイルを移動して保存
                move_uploaded_file($pfile_temp, $pfile_destination);
                echo json_encode(["success" => "正常に挿入されました"]);
            } else {
                echo json_encode(["success" => "挿入されていません。"]);
            }

            $stmt->close();
        } else {
            echo json_encode(["success" => "データが正しい形式ではありません"]);
        }
        break;

    case "DELETE":
        // DELETEメソッドの処理
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}
?>

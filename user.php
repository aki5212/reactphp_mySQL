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
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

// さまざまな HTTP メソッドを処理する
switch ($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);

        if (isset($path[4]) && is_numeric($path[4])) {
            $json_array = array();
            $userid = $path[4];

            $getuserrow = mysqli_query($db_conn, "SELECT * FROM tbl_user WHERE userid='$userid'");
            while ($userrow = mysqli_fetch_array($getuserrow)) {
                $json_array['rowUserdata'] = array(
                    'id' => $userrow['userid'],
                    'username' => $userrow['username'],
                    'usermail' => $userrow['usermail'],
                    'status' => $userrow['status']
                );
            }
            echo json_encode($json_array['rowUserdata']);

        } else {
            $alluser = mysqli_query($db_conn, "SELECT * FROM tbl_user");
            if (mysqli_num_rows($alluser) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($alluser)) {
                    $json_array["userdata"][] = array(
                        "id" => $row['userid'],
                        "username" => $row["username"],
                        "usermail" => $row["usermail"],
                        "status" => $row["status"]
                    );
                }
                echo json_encode($json_array["userdata"]);
            } else {
                echo json_encode(["result" => "Please check the Data"]);
            }
        }
        break;

    case "POST":
        $userpostdata = json_decode(file_get_contents("php://input"));
        if ($userpostdata) {
            $username = $userpostdata->username;
            $usermail = $userpostdata->usermail;
            $status = $userpostdata->status;
            $result = mysqli_query($db_conn, "INSERT INTO tbl_user (username, usermail, status) 
                VALUES('$username', '$usermail', '$status')");

            if ($result) {
                echo json_encode(["success" => "ユーザーレコードが正常に登録されました"]);
            } else {
                echo json_encode(["error" => "ユーザーの登録に失敗しました。データを確認してください！"]);
            }
        } else {
            echo json_encode(["error" => "Invalid input data"]);
        }
        break;

    case "PUT":
        $userUpdate = json_decode(file_get_contents("php://input"));
        if ($userUpdate) {
            $userid = $userUpdate->id;
            $username = $userUpdate->username;
            $usermail = $userUpdate->usermail;
            $status = $userUpdate->status;

            $updateData = mysqli_query($db_conn, "UPDATE tbl_user SET username='$username', usermail='$usermail', status='$status' WHERE userid='$userid'");
            if ($updateData) {
                echo json_encode(["success" => "ユーザーレコードが正常に更新されました"]);
            } else {
                echo json_encode(["error" => "ユーザーの更新に失敗しました。データを確認してください！"]);
            }
        } else {
            echo json_encode(["error" => "Invalid input data"]);
        }
        break;

    case "DELETE":
        $path = explode('/', $_SERVER["REQUEST_URI"]);
        if (isset($path[4]) && is_numeric($path[4])) {
            $userid = $path[4];
            $result = mysqli_query($db_conn, "DELETE FROM tbl_user WHERE userid='$userid'");
            if ($result) {
                echo json_encode(["success" => "ユーザーレコードが正常に削除されました"]);
            } else {
                echo json_encode(["error" => "ユーザーの削除に失敗しました。データを確認してください！"]);
            }
        } else {
            echo json_encode(["error" => "無効なユーザーIDです"]);
        }
        break;

    default:
        echo json_encode(["error" => "無効なリクエストメソッドです"]);
        break;
}
?>

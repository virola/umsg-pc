<?php 

include '../../../umsg/common/db.php';

$msg_text = array(
    '0' => '成功',
    '1' => '用户不正确',
    '2' => '请输入内容',
    '10' => '数据库连接错误!'
);

if ($_POST) {

    $content = $_POST['content'];
    $user = $common['user'];
    $targetid = $_GET['toid'];

    if (!$content) {
        $msg_code = 2;
    }
    else {
        if ($targetid) {
            $sql = "insert into message (toid, authorid, content, dateline) "
                ."values(".$targetid.",".$user['userid'].", '".$content."',".time().");";
            $result = mysql_query($sql, $con);
            if ($result) {
                $msg_code = 0;
            }
            else {
                $msg_code = 10;
            }
        }
        else {
            $msg_code = 1;
        }
    }
}
else {
    $msg_code = 0;
}


$data = array(
    'status' => $msg_code,
    'statusInfo' => $msg_text[$msg_code],
);

echo json_encode($data);
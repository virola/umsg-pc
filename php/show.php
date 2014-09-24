<?php 
include "../../umsg/common/db.php";
?>
<?php
$user = $common['user'];

$targetid = $_GET['uid'];
if (!$targetid) {
    url('index.php');
}

$sqltuser = 'select * from user where userid='.$targetid.';';
$result = mysql_query($sqltuser, $con);
if (!$result) {
    url('index.php');
}

while($row = mysql_fetch_array($result)) {
    $tuser = array(
        'userid' => $row['userid'],
        'username' => $row['username'],
        'avator' => getAvator(),
    );
}

$doc_title = $tuser['username'];

$sqljoin = 'select * from message'
    .' where (message.toid='.$user['userid'].' and message.authorid='.$targetid.') '
    .'OR (message.toid='.$targetid.' and message.authorid='.$user['userid'].') '
    .'order by dateline desc limit 0,5;';
$result = mysql_query($sqljoin, $con);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $issend = ($row['authorid'] == $targetid ? false : true);
        $msg_arr[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => $row['content'],
            'dateline' => date('m-d H:i', $row['dateline']),
            'issend' => $issend,
            'avator' => ($issend ? $user['avator'] : $tuser['avator']),
        );
    }

    $msg_arr = array_reverse($msg_arr);
}
?>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>有味</title>
<link rel="stylesheet" href="../dep/font-awesome/css/font-awesome.min.css" />
<link rel="stylesheet" href="../asset/css/main.css" />
</head>
<body>

<?php include('./common/header.php') ?>
<div class="page">
    <div class="feed-loading hide"><span>加载中…</span></div>
    
    <div class="main clear">

        <div id="page-chat" class="ct">
                <ul id="talk-msg-list" class="talk-msg" data-url="ajax/msglist.php?uid=<?php echo $targetid?>">
                    <?php foreach ($msg_arr as $msg) { ?>
                    <li class="clear">
                        <time class="date-talk"><?php echo $msg['dateline']?></time>
                        <section class="<?php if ($msg['issend']){echo 'me-talk';} else {echo 'guest-talk';} ?>">
                            <a class="avatar-talk" href="#" title="">
                                <img class="avator-round" src="<?php echo $msg['avator']?>">
                            </a>
                            <div class="content-talk">
                                <p><?php echo $msg['content']?></p>
                            </div>
                        </section>
                    </li>
                    <?php } ?>
                </ul>
        </div>

        <aside class="side">
            <div class="appl">
                <ul>
                    <li class="fixed current"><em class="notice-pm"></em><a href="#">纸条列表</a></li>
                </ul>
            </div>
        </aside>
    
    </div>

</div>

<?php include('./common/footer.php') ?>
</body>
</html>
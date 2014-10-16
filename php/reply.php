<?php
include "../../umsg/common/db.php";

$user = $common['user'];
$sql = 'select toid, username, authorid, max(dateline) as timeline, count(*) as msgcount from message,user where delstatus=0 and message.toid=1 and message.authorid=user.userid group by authorid order by dateline desc  limit 0,10';
$sqljoin = 'select toid, authorid, content, max(dateline) as timeline, count(*) as msgcount, username from message,user where delstatus=0 and message.toid='.$user['userid'].' and authorid=userid group by authorid order by timeline desc;';
$result = mysql_query($sqljoin);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $msg_arr[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => getLatestMsg($row['authorid'], $user['userid'], $con),
            'dateline' => timeFormatPC($row['timeline']),
            'realtime' => $row['timeline'],
            'avator' => getAvator(),
            'newcount' => mt_rand(0, 10),
        );
    }
}

$project = 'http://'.$_SERVER['REMOTE_ADDR'].':'.$_SERVER['SERVER_PORT'].'/umsg/';

$mod = 'reply';

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
        <article class="ct">
            <div class="operation clear">
                <a class="btn btn-default" href="javascript:;" id="btn-mark-read" data-command="markread" data-url="#">全部标记已读</a>
                <a class="btn btn-default fr" href="javascript:;" id="btn-blackuser"><i class="fa fa-ban block-ico"></i>屏蔽用户</a>
            </div>
            <div class="msg-list msg-topic-list">
                <?php foreach ($msg_arr as $msg) { ?>
                <dl class="msg-list-item clear <?php if(mt_rand(0, 2) < 1) {echo 'msg-topic-new';} ?>">
                    <dd class="user-avator fl">
                        <a href="#">
                            <img class="avator-round" src="<?php echo $project.$msg['avator']?>">
                        </a>
                    </dd>
                    <dt class="user-info fr">
                        <h4 class="username"><a href="#"><?php echo $msg['username']?></a></h4>
                        <p class="msg-text"><a href="#">在话题《一场完美的旅行应该是这样》中回复了你</a>
                        </p>
                    </dt>
                    <span class="plus">
                        <span class="dateline"><?php echo $msg['dateline']?></span>
                        <a class="operate" data-command="ban" data-uid="<?php echo $msg['userid']?>" href="javascript:;"><i class="fa fa-ban"></i></a>
                    </span>
                </dl>
                <?php } ?>
            </ul>
        </article>

        <aside class="side">
            <?php include("./common/side.php") ?>
        </aside>
    </div>
</div>

<?php include('./common/footer.php') ?>
</body>
</html>
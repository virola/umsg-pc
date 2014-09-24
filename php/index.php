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
                <a class="btn btn-default" href="javascript:;" id="btn-batch-del">批量删除</a>
                <a class="btn btn-default" href="javascript:;" id="btn-mark-read">全部标记已读</a>
                <a class="btn btn-primary fr popup-trigger" href="#" data-id="new-msg">写纸条</a>
            </div>
            <div class="operation-del hide clear">
                <label for="delete-all" class="delete-all"><input type="checkbox" name="chkall" id="delete-all" class="checkbox">全选</label>
                <a class="btn btn-primary" href="javascript:;" id="btn-del-confirm">确定</a>
                <a class="btn btn-primary" href="javascript:;" id="btn-del-cancel">取消</a>
            </div>
            <div class="msg-list">
                <?php foreach ($msg_arr as $msg) { ?>
                <dl data-url="show.php?uid=<?php echo $msg['userid'] ?>" class="msg-list-item clear">
                    <dd class="list-check fl">
                        <input type="checkbox" name="deletepm_deluid[]" class="checkbox hide" value="<?php echo $msg['userid'] ?>">
                    </dd>
                    <dd class="user-avator fl">
                        <img class="avator-round" src="<?php echo $project.$msg['avator']?>">
                    </dd>
                    <dt class="user-info fr">
                        <h4 class="username"><?php echo $msg['username']?></h4>
                        <p class="msg-text"><?php echo $msg['content']?></p>
                    </dt>
                    <span class="plus">
                        <span class="dateline"><?php echo $msg['dateline']?></span>
                        <a class="operate" href="javascript:;"><i class="fa fa-angle-down"></i></a>
                        <?php if ($msg['newcount']) {?>
                        <i class="bubble bubble-dot-red"><?php echo $msg['newcount']?></i>
                        <?php }?>
                    </span>
                    <ul class="operate-list layer-menu-list hide">
                        <li><a href="#">删除</a></li>
                        <li><a href="#">屏蔽用户</a></li>
                    </ul>
                        
                </dl>
                <?php } ?>
            </ul>
        </article>

        <aside class="side">
            <div class="appl">
                <ul>
                    <li class="fixed current"><em class="notice-pm"></em><a href="#">纸条列表</a></li>
                </ul>
            </div>
        </aside>
    </div>
</div>

<div class="popup" id="popup-new-msg">
    <h2 class="popup-title">写纸条</h2>
    <div class="popup-content msg-form">

        <div class="form-line clear">
                <h3 class="fl form-label">发&nbsp;&nbsp;给：</h3>
                <div class="fl form-item">
                    <div class="inputbox">
                        <input type="text" placeholder="请输入对方用户名" class="text input" id="add-input">
                    </div>
                    <p class="tip-text">多个用户使用逗号、分号或回车提示系统分开</p>
                </div>
        </div>
        <div class="form-line clear">
            <h3 class="fl form-label">内&nbsp;&nbsp;容：</h3>
            <div class="fl form-item">
                <textarea class="textbox"></textarea>
                <p class="num hide">还可以输入<span>300</span>字</p>
            </div>
        </div>
        <div class="btn-line clear">
            <a class="btn btn-primary btn-send btn-noloading" href="#"><b class="loading"></b>发送</a>
        </div>            
    </div>

    <span class="close"><i class="fa fa-times"></i></span>
</div>

<?php include('./common/footer.php') ?>
</body>
</html>
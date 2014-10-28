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

$action = $_GET['action'];
if ($action == 'new') {
    $showPopup = true;

    $targetid = $_GET['uid'];

    $sqltuser = 'select * from user where userid='.$targetid.';';
    $result = mysql_query($sqltuser, $con);
    if ($result) {
        while($row = mysql_fetch_array($result)) {
            $tuser = array(
                'userid' => $row['userid'],
                'username' => $row['username'],
                'avator' => getAvator(),
            );
        }
    }
}

$mod = 'note';

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
                <a class="btn btn-default" href="javascript:;" id="btn-mark-read" data-command="markread" data-url="#">全部标记已读</a>
                <a class="btn btn-default" href="javascript:;" id="btn-blackuser" data-command="blackmanage"><i class="fa fa-ban block-ico"></i>屏蔽用户</a>
                <a class="btn btn-primary fr popup-trigger" href="#" data-id="new-msg"><i class="fa fa-edit"></i>写纸条</a>
            </div>
            <div class="operation-del hide clear">
                <label for="delete-all" class="delete-all"><input type="checkbox" name="chkall" id="delete-all" class="checkbox">全选</label>
                <a class="btn btn-primary" href="javascript:;" id="btn-del-confirm">确定删除</a>
                <a class="btn btn-default btn-del-cancel" href="javascript:;">取消</a>
            </div>
            <div class="msg-list checkbox-list">
                <?php foreach ($msg_arr as $msg) { ?>
                <div class="msg-item">
                    <div class="list-check">
                        <input type="checkbox" name="deletepm_deluid[]" class="checkbox hide" value="<?php echo $msg['userid'] ?>">
                    </div>
                    <dl data-url="show.php?uid=<?php echo $msg['userid'] ?>" class="msg-list-item clear">
                        
                        <dd class="user-avator fl">
                            <img class="avator-round" src="<?php echo $project.$msg['avator']?>">
                        </dd>
                        <dt class="user-info fr">
                            <h4 class="username"><?php echo $msg['username']?></h4>
                            <p class="msg-text"><?php echo $msg['content']?></p>
                        </dt> 
                    </dl>
                    <span class="plus">
                        <span class="dateline"><?php echo $msg['dateline']?></span>
                        <a class="operate" href="javascript:;"><i class="fa fa-angle-down"></i></a>
                        <?php if ($msg['newcount']) {?>
                        <i class="bubble bubble-dot-red"><?php echo $msg['newcount']?></i>
                        <?php }?>
                    </span>
                    <ul class="operate-list layer-menu-list hide">
                        <li><a href="#" data-command="talkdel" data-value="{talkid:'<?php echo $msg['msgid'] ?>',username:'<?php echo $msg['username']?>'}">删除</a></li>
                        <li><a href="#" data-command="userban" data-value="{uid:'<?php echo $msg['userid'] ?>',username:'<?php echo $msg['username']?>'}">屏蔽用户</a></li>
                    </ul>
                </div>
                <?php } ?>
            </ul>
        </article>

        <aside class="side">
            <?php include("./common/side.php") ?>
        </aside>
    </div>
</div>

<div class="popup" id="popup-new-msg">
    <h2 class="popup-title">写纸条</h2>
    <div class="popup-content msg-form" id="new-msg-form">

        <div class="form-line clear">
                <h3 class="fl form-label">发&nbsp;&nbsp;给：</h3>
                <div class="fl form-item">
                    <div class="inputbox inputbox-username">
                        <input type="text" placeholder="请输入对方用户名" class="text input" id="add-input">
                    </div>
                    <p class="tip-text">多个用户使用逗号、分号或回车提示系统分开</p>
                </div>
        </div>
        <div class="form-line clear">
            <h3 class="fl form-label">内&nbsp;&nbsp;容：</h3>
            <div class="fl form-item">
                <textarea class="textbox" name="content"></textarea>
                <p class="num hide">还可以输入<span>300</span>字</p>
            </div>
        </div>
        <div class="btn-line clear">
            <a id="btn-send" class="btn btn-primary btn-noloading" href="javascript:;"><b class="loading"></b>发送</a>
        </div>            
    </div>

    <a class="close" href="javascript:;"><i class="fa fa-times"></i></a>
</div>

<div class="popup" id="popup-black-manage">
    <h2 class="popup-title">屏蔽纸条</h2>
    <div class="popup-content black-form" id="black-manage-form">

        <div class="form-line clear">
            <div class="input-box fl">
                <input id="add-black-input" class="text input">
            </div>
            <a href="javascript:;" class="btn btn-default fr" id="add-black-btn">添加</a>
        </div>
        <div class="form-line clear">
            <p class="black-form-info">已屏蔽用户2个</p>
            <ul class="black-list clear">
                <li>
                    <div class="user-head fl"><img src="http://127.0.0.1:8008/umsg/static/asset/img/temp/user_1.jpg"></div>
                    <div class="li-info fl">
                        <h4 class="title">新浪</h4>
                        <div class="li-btn">
                            <a href="javascript:void(0);" data-command="unblock" data-value="{uids:2028810631,username:'新浪'}" class="btn-small">解除屏蔽</a>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="user-head fl"><img src="http://127.0.0.1:8008/umsg/static/asset/img/temp/user_1.jpg"></div>
                    <div class="li-info fl">
                        <h4 class="title">新浪22222</h4>
                        <div class="li-btn">
                            <a href="javascript:void(0);" data-command="unblock" data-value="{uids:2028810631,username:'新浪'}" class="btn-small">解除屏蔽</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="btn-line clear">
            <a id="btn-close" class="btn btn-default popup-close" href="javascript:;">关闭</a>
        </div>            
    </div>

    <a class="close" href="javascript:;"><i class="fa fa-times"></i></a>
</div>


<?php include('./common/footer.php') ?>
</body>
</html>
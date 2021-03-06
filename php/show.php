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
$loadend = 0;

$sqljoin = 'select * from message'
    .' where (message.toid='.$user['userid'].' and message.authorid='.$targetid.') '
    .'OR (message.toid='.$targetid.' and message.authorid='.$user['userid'].') '
    .'order by dateline desc limit 0,5;';
$result = mysql_query($sqljoin, $con);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $issend = ($row['authorid'] == $targetid ? false : true);
        $min = (int)date('i', $row['dateline']);
        $msg_arr[] = array(
            'pmid' => $row['pmid'],
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => $row['content'],
            'dateline' => date('Y年n月d日 H:i', $row['dateline']),
            'issend' => $issend,
            'avator' => ($issend ? $user['avator'] : $tuser['avator']),
        );
    }

    if (count($msg_arr) < 5) {
        $loadend = 1;
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
<div class="page page-chat">
    <div class="main clear">

        <div id="page-chat" class="ct chat-ct">
            <h3 class="title">与 <strong><?php echo $tuser['username'] ?></strong> 的对话</h3>

            <div class="operation clear">
                <a class="btn btn-default" href="javascript:;" id="btn-batch-del">批量删除</a>
                <a class="btn btn-default" href="javascript:;" id="btn-adduser" data-command="adduser"><i class="fa fa-plus"></i>邀请用户</a>
                <a class="btn btn-default hide" href="javascript:;" id="btn-search">搜索对话</a>
                <a class="btn btn-default fr" href="javascript:;" data-command="userban" data-value="{uid:'<?php echo $tuser['userid'] ?>',username:'<?php echo $tuser['username'] ?>'}"><i class="fa fa-ban block-ico"></i>屏蔽用户</a>
            </div>
            <div class="operation-del hide clear">
                <label for="delete-all" class="delete-all"><input type="checkbox" name="chkall" id="delete-all" class="checkbox">全选</label>
                <a class="btn btn-primary btn-delpm-confirm" href="javascript:;">确定删除</a>
                <a class="btn btn-default btn-del-cancel" href="javascript:;">取消</a>
            </div>
            <div class="operation-search hide clear">
                <label>查找内容：</label><input type="search" name="content" id="msg-search-input">
                <a href="javascript:;" class="btn btn-primary" id="btn-search-confirm"><i class="fa fa-search"></i>确定</a>
                <a href="javascript:;" class="btn btn-default" id="btn-search-cancel">取消</a>
            </div>

            <div class="msg-form" id="msg-form">
                <p class="msg-form-text">写纸条给： <strong><?php echo $tuser['username'] ?></strong></p>
                <form id="chat-sendmsg-form" action="ajax/newmessage.php?toid=<?php echo $targetid?>" method="post" onsubmit="return false;">
                    <div class="msg-textbox" id="chat-sendmsg-box">
                        <textarea class="textarea txt"></textarea>
                    </div>
                    <div class="form-btn btn-line hide">
                        <a id="form-send-btn" href="javascript:;" class="btn btn-primary">发送</a>
                    </div>
                </form>
            </div>

            <ul id="talk-msg-list" class="talk-msg checkbox-list" data-url="ajax/msglist.php?uid=<?php echo $targetid?>">
                <?php foreach ($msg_arr as $msg) { ?>
                <li class="talk-msg-item clear">
                    <fieldset class="date-talk">
                        <legend class="time-title"><?php echo $msg['dateline']?></legend>
                    </fieldset>
                    <section class="<?php if ($msg['issend']){echo 'me-talk';} else {echo 'guest-talk';} ?> clear">
                        <a class="avatar-talk user-avator" href="#" title="">
                            <img class="avator-round" src="<?php echo $project.$msg['avator']?>">
                        </a>
                        <div class="content-talk">
                            <div class="msg-arrow">
                              <em class="line-c">◆</em><span class="bg-c">◆</span>
                            </div>
                            <div class="msg-dialog-box">
                                <input type="checkbox" name="deletepm_delid[]" class="checkbox hide" value="<?php echo $msg['pmid'] ?>">
                                <p class="msg-dialog-text"><?php echo $msg['content']?></p>
                            </div>
                        </div>
                    </section>
                </li>
                <?php } ?>
            </ul>

            <?php if (!$loadend) {?>
            <div id="talk-msg-load" class="load-more">点击加载更多...</div>

            <div class="operation-del hide hide-forever clear main-foot">
                <label for="delete-all-foot" class="delete-all"><input type="checkbox" name="chkall" id="delete-all-foot" class="checkbox">全选</label>
                <a class="btn btn-primary btn-delpm-confirm" href="javascript:;">确定删除</a>
                <a class="btn btn-primary btn-del-cancel" href="javascript:;">取消</a>
            </div>
            
            <?php } ?>

        </div>

        <aside class="side">
            <?php include("./common/side.php") ?>
        </aside>
    
    </div>

</div>


<div class="popup" id="popup-talkuser-manage">
    <h2 class="popup-title">邀请用户加入会话</h2>
    <div class="popup-content black-form talkuser-form" id="talkuser-manage-form">

        <div class="form-line clear">
            <div class="input-box fl">
                <input id="add-talkuser-input" class="text input">
            </div>
            <a href="javascript:;" class="btn btn-default fr" id="add-talkuser-btn">添加</a>
        </div>
        <div class="form-line clear">
            <p class="black-form-info">当前会话用户 2 个</p>
            <ul class="black-list clear">
                <li>
                    <div class="user-head fl"><img src="http://127.0.0.1:8008/umsg/static/asset/img/temp/user_1.jpg"></div>
                    <div class="li-info fl">
                        <h4 class="title">有节操</h4>
                        <div class="li-btn">
                            <a href="javascript:void(0);" data-command="deluser" data-value="{uids:2028810631,username:'有节操'}" class="btn-small">删除用户</a>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="user-head fl"><img src="#"></div>
                    <div class="li-info fl">
                        <h4 class="title">小甜心</h4>
                        <div class="li-btn">
                            <a href="javascript:void(0);" data-command="deluser" data-value="{uids:2028810631,username:'小甜心'}" class="btn-small">删除用户</a>
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
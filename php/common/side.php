<div class="appl">
    <ul>
        <li <?php if (!$_GET['uid']) {?>class="current"<?php }?>>
            <a class="title" href="index.php"><i class="fa fa-envelope"></i>消息列表</a>
            <ul class="list-sub">
                <li class="<?php if($mod=='at') {echo 'current';} ?>"><a href="at.php"><i class="fa fa-at bold"></i>提到我的</a></li>
                <li class="<?php if($mod=='reply') {echo 'current';} ?>"><a href="reply.php"><i class="fa fa-comment-o bold"></i>话题回复</a></li>
                <li class="<?php if($mod=='note') {echo 'current';} ?>"><a href="note.php"><i class="fa fa-comments"></i>纸条</a></li>
            </ul>
        </li>
        <?php if ($tuser['userid']) {?>
        <li class="current"><a class="title" href="show.php?uid=<?php echo $tuser['userid']?>" title="<?php echo $tuser['username']?>"><i class="fa fa-user"></i><?php echo $tuser['username']?></a></li>
        <?php } ?>
    </ul>
</div>
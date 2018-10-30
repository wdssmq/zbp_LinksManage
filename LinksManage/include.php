<?php
#注册插件
RegisterPlugin("LinksManage", "ActivePlugin_LinksManage");

function ActivePlugin_LinksManage()
{
	Add_Filter_Plugin('Filter_Plugin_Admin_Header', 'LinksManage_Head');
	Add_Filter_Plugin('Filter_Plugin_Admin_CategoryMng_SubMenu', 'LinksManage_AddMenu');
	Add_Filter_Plugin('Filter_Plugin_Admin_PageMng_SubMenu', 'LinksManage_AddMenu');
	Add_Filter_Plugin('Filter_Plugin_Admin_ModuleMng_SubMenu', 'LinksManage_ModuleMenu');
}
function LinksManage_ModuleMenu()
{
	global $zbp;

	$array = $zbp->GetModuleList(
		array('*'),
		array(array('=', 'mod_Source', 'plugin_LinksManage'))
	);
	$mods = array();
	foreach ($array as $mod) {
		$mods[] = $mod->FileName;
	}

	$str = '<a href="' . LinksManage_Path("main", "host") . '" class="LinksManage"><span class="m-left">新建链接模块</span></a>';

	$url = LinksManage_Path("main", "host");
	$mod = LinksManage_Path("bakfile") . '|' . join('|', $mods);
	$str .= "<input class=\"js-mod\" type=\"hidden\" value=\"{$mod}\">";
	echo $str;
}
function LinksManage_Head()
{
	echo "<link rel=\"stylesheet\" href=\"" . LinksManage_Path("style", "host") . "\">";
	echo "<script src=\"" . LinksManage_Path("script", "host") . "\"></script>";
}
function LinksManage_AddMenu()
{
	global $zbp;
	echo '<a href="' . LinksManage_Path("main.php?edit=navbar", "host") . '" class="LinksManage"><span class="m-left">导航管理</span></a>';
}
function LinksManage_Path($file, $t = "path")
{
	global $zbp;
	$result = $zbp->$t . "zb_users/plugin/LinksManage/";
	switch ($file) {
		case "style":
			return $result . "var/style.css";
			break;
		case "script":
			return $result . "var/script.js";
			break;
		case "bakdir":
			return $result . "backup/";
			break;
		case "bakfile":
			return 'navbar|favorite|link';
			break;
		case "main":
			return $result . "main.php";
			break;
		default:
			return $result . $file;
	}
}
function InstallPlugin_LinksManage()
{
	global $zbp;
	$dir = LinksManage_Path("bakdir");
	if (!is_dir($dir)) {
		@mkdir($dir, 0755);
	}
	$links = explode('|', LinksManage_Path("bakfile"));
	foreach ($links as $mod) {
		$backup = $zbp->modulesbyfilename[$mod]->Content;
		file_put_contents(LinksManage_Path("bakdir") . $mod . '.txt', $backup);
	}
}
function UninstallPlugin_LinksManage()
{
	global $zbp;
	$links = explode('|', LinksManage_Path("bakfile"));
	foreach ($links as $mod) {
		$file = LinksManage_Path("bakdir") . $mod . '.txt';
		if (is_file($file)) {
			$backup = file_get_contents($file);
			$module = $zbp->modulesbyfilename[$mod];
			$module->Content = $backup;
			$module->Save();
			$zbp->AddBuildModule($module->FileName);
			unlink($file);
		}
	}
}
<?php
/**
 * Created by PhpStorm.
 * User: Alexeenko Sergey Aleksandrovich
 * Phone: +79231421947
 * Email: sergei_alekseenk@list.ru
 * Date: 05.08.2019
 * Time: 11:27
 */

namespace alse0017\dismsg;

use yii\web\AssetBundle;

class Asset extends AssetBundle
{
	public $sourcePath = '@alse0017/dismsg/assets';
	public $css = [
		'styles.css',
	];
	public $js = [
		'jquery.disMsg.js'
	];
	public $depends = [
		'yii\web\JqueryAsset',
	];
}
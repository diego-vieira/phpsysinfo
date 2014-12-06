<?php
/**
 * start page for webaccess
 * redirect the user to the supported page type by the users webbrowser (js available or not)
 *
 * PHP version 5
 *
 * @category  PHP
 * @package   PSI
 * @author    Michael Cramer <BigMichi1@users.sourceforge.net>
 * @copyright 2009 phpSysInfo
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @version   SVN: $Id: index.php 687 2012-09-06 20:54:49Z namiltd $
 * @link      http://phpsysinfo.sourceforge.net
 */
/**
 * define the application root path on the webserver
 * @var string
 */
define('APP_ROOT', dirname(__FILE__));

/**
 * internal xml or external
 * external is needed when running in static mode
 *
 * @var boolean
 */
define('PSI_INTERNAL_XML', false);

if (version_compare("5.2", PHP_VERSION, ">")) {
    die("PHP 5.2 or greater is required!!!");
}
if (!extension_loaded("pcre")) {
    die("phpSysInfo requires the pcre extension to php in order to work properly.");
}

require_once APP_ROOT.'/includes/autoloader.inc.php';

// Load configuration
require_once APP_ROOT.'/read_config.php';

if (!defined('PSI_CONFIG_FILE') || !defined('PSI_DEBUG')) {
    $tpl = new Template("/templates/errors.html");
    $tpl->set('errors', array(array("message"=>"Configuration file '".PSI_CONFIG_FILE."' does not exist or is not readable by the webserver")));
    echo $tpl->fetch();
    exit(-1);
}

require_once APP_ROOT.'/systemcheck.php';

if (Error::singleton()->errorsExist()) {
    $tpl = new Template("/templates/errors.html");
    $tpl->set('errors', Error::singleton()->getErrors());
    echo $tpl->fetch();
    exit(-1);
}

$tpl = new Template("/templates/index.html");
$tpl->set('plugins', CommonFunctions::getPlugins());
echo $tpl->fetch();

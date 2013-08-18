<?php
/**
 * generate the xml
 *
 * PHP version 5
 *
 * @category  PHP
 * @package   PSI_XML
 * @author    Michael Cramer <BigMichi1@users.sourceforge.net>
 * @copyright 2009 phpSysInfo
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @version   SVN: $Id: xml.php 614 2012-07-28 09:02:59Z jacky672 $
 * @link      http://phpsysinfo.sourceforge.net
 */

 /**
 * application root path
 *
 * @var string
 */
define('APP_ROOT', dirname(__FILE__));

/**
 * internal xml or external
 * external is needed when running in static mode
 *
 * @var boolean
 */
define('PSI_INTERNAL_XML', true);

require_once APP_ROOT.'/includes/autoloader.inc.php';

require_once APP_ROOT.'/read_config.php';

// check what xml part should be generated
/*
if (isset($_GET['plugin'])) {
    $plugin = basename(htmlspecialchars($_GET['plugin']));
    if ($plugin == "complete") {
        $output = new WebpageXML(true, null);
    } elseif ($plugin != "") {
        $output = new WebpageXML(false, $plugin);
    } else {
        unset($output);
    }
} else {
    $output = new WebpageXML(false, null);
}
 */
$output = new JSONOutput(true, null);

// if $output is correct generate output in proper type
if (isset($output) && is_object($output)) {

    $json = $output->run();

    header("Cache-Control: no-cache, must-revalidate\n");

    // application/javascript
    if (isset($_GET['jsonp'])) {
        header("Content-Type: application/javascript\n\n");
        // check for jsonp with callback name restriction
        echo (!preg_match('/[^A-Za-z0-9_]/', $_GET['callback']) ? $_GET['callback'] : '') . '('.$json.')';
    }
    else {
        header("Content-Type: application/json\n\n");
        echo $json;
    }
}


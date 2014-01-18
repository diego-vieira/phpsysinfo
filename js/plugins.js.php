<?php
header("Content-Type: application/json\n\n");

define('APP_ROOT', realpath(dirname(__FILE__) . '/../'));

$requested_plugins = isset($_SERVER['QUERY_STRING']) ? explode(',', $_SERVER['QUERY_STRING']) : array();

foreach ($requested_plugins as $plugin) {
    $jsfile = APP_ROOT . '/plugins/' . $plugin . '/script.js';

    if (file_exists($jsfile)) {
        echo "// file: " . $jsfile . "\n";
        include $jsfile;
        echo "\n";
    }
}

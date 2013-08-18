<?php

// check extensions
$required_extensions = array('pcre', 'mbstring', 'SimpleXML', 'xml');

// also require 'com_dotnet' on Windows systems
if (PHP_OS == 'WINNT') {
    $required_extensions[] = 'com_dotnet';
}

$loaded_extensions = get_loaded_extensions();
foreach ($required_extensions as $ext) {
    if (!in_array($ext, $loaded_extensions)) {
        Error::singleton()->adderror("warn", "phpsysinfo requires extension '" . $ext . "' to be loaded");
    }
}

// safe mode check
$safe_mode = @ini_get("safe_mode") ? true : false;
if ($safe_mode) {
    Error::singleton()->adderror("warn", "phpsysinfo requires to set off 'safe_mode' in 'php.ini'");
}

// include path check
$include_path = @ini_get("include_path");
if ($include_path && ($include_path!="")) {
    $include_path = preg_replace("/(:)|(;)/", "\n", $include_path);
    if (preg_match("/^\.$/m", $include_path)) {
        $include_path = ".";
    }
}
if ($include_path != ".") {
    Error::singleton()->adderror("warn", "phpsysinfo requires '.' inside the 'include_path' in php.ini");
}

// popen mode check
if (defined("PSI_MODE_POPEN") && psi_mode_popen === true) {
    Error::singleton()->adderror("warn", "installed version of php does not support proc_open() function, popen() is used");
}


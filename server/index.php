<?php
require_once 'simple_html_dom.php';

$url = 'http://typhoon-tower.obninsk.org/ru/10-minute.asp';
$html = file_get_html($url);
$date = [];
$time = [];
$sensorsData = [];

if ($html) {
    foreach ($html->find('table') as $table) {
        $rows = $table->find('tr');

        if (count($rows[0]->children) != 5) {
            continue;
        }

        foreach ($rows as $row) {
            $cols = $row->find('td');

            if (count($cols)) {
                $sensorData = [];

                foreach ($cols as $col) {
                    $val = trim($col->innertext);

                    if ($val == '*') {
                        $val = null;
                    } else {
                        $val = str_replace(',', '.', $val);

                        if ($val[0] == '0') {
                            $val = substr($val, 1);
                        }

                        $val = strval(floatval($val)); // сделано строкой из-за того, что precision зависит
                                                       // от настроек сервера, и после обработки json_encode
                                                       // у значений могло изменяться количество цифр после запятой
                    }

                    $sensorData[] = $val;
                }

                $sensorsData[] = $sensorData;
            }
        }

        break;
    }

    $datePattern = "/\d{2}.\d{2}.\d{4}/";
    preg_match($datePattern, $html->plaintext, $date);

    $timePattern = "/\d+:\d{2}:\d{2}/";
    preg_match($timePattern, $html->plaintext, $time);

    $html->clear();
    unset($html);
}

$json = array(
    "date" => $date[0] ?? null,
    "time" => $time[0] ?? null,
    "sensorsData" => $sensorsData
);

print json_encode($json);

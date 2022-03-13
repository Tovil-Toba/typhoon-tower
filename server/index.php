<?php
declare(strict_types=1);

use JetBrains\PhpStorm\ArrayShape;

require_once 'simple_html_dom.php';

$urls = [
    'http://vmm310.ru/ru/10-minute.asp',
    'http://typhoon-tower.obninsk.org/ru/10-minute.asp',
    'http://194.67.145.26/ru/10-minute.asp',
];

foreach ($urls as $url) {
    $data = getData($url);

    if (count($data['sensorsData'])) {
        break;
    }
}

print json_encode($data);

#[ArrayShape([
    'date' => 'string|null',
    'time' => 'string|null',
    'sensorsData' => 'array'
])]
function getData(string $url): array
{
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

    return [
        'date' => $date[0] ?? null,
        'time' => $time[0] ?? null,
        'sensorsData' => $sensorsData
    ];
}
